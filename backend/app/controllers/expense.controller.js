const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');

exports.findAll = async (req, res) => {
  try {
    const {
      orderBy,
      direction,
      pageSize,
      pageNumber,
      search,
      active,
      fromDate,
      toDate,
      userId,
      categoryId,
      isCashIn
    } = req.query;
    let searchQuery = 'where true';

    if (fromDate && toDate) {
      searchQuery += ` and date::date between  '${fromDate}'::date and '${toDate}'::date `;
    }
    if (userId) {
      searchQuery += ` and expense.user_id = ${+userId} `;
    }
    if (categoryId) {
      searchQuery += ` and expense.category_id = ${+categoryId} `;
    }
    if (res.locals.tokenData.role === 'Employees') {
      searchQuery += ` and expense.user_id = ${res.locals.tokenData.id} `;
    }
    if (isCashIn !== 'undefined') {
      searchQuery += ` and expense.is_cash_in = ${isCashIn} `;
    }
    const offset = pageSize * pageNumber - pageSize;
    if (search) {
      searchQuery += ` and
        (description ilike '%${search}%'
          or expense.id::text ilike '%${search}%'
          or u.user_name ilike '%${search}%'
          or amount::text ilike '%${search}%'
          or c.name::text ilike '%${search}%'
          or expense.date::text ilike '%${search}%'
        )`;
    }
    searchQuery += ` and expense.is_active = ${active}`;
    let query = `
        select count(expense.id) over() as total,
          expense.id as "expenseId",
          description ,
          expense.is_deleted as "isDeleted",
          amount as "amount",
          expense.user_id as "userId",
          u.user_name as "userName",
          expense.date as "expenseDate",
          expense.category_id as "categoryId",
          expense.is_approved as "isApproved",
          expense.is_active as "isActive",
          expense.is_cash_in as "isCashIn",
          c.name as "categoryName"
       FROM expenses expense
      INNER join categories c on c.id = expense.category_id
      INNER join users u  on u.id = expense.user_id
      ${searchQuery}
      order by ${orderBy} ${direction}
      OFFSET ${offset} LIMIT ${pageSize}`;

    const response = await pool.query(query);

    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE expenses SET is_deleted = true  where "id" = '${id}'`
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.add = async (req, res) => {
  try {
    const { description, amount, categoryId, isCashIn } = req.body;

    if (!description || !amount || !categoryId) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const query = `
    INSERT INTO expenses (user_id, description, amount, date, category_id, is_cash_in, is_approved )
    VALUES (${res.locals.tokenData.id}, '${description}', ${amount}, now(), ${categoryId}, ${isCashIn}, false)
    `;

    await pool.query(query);

    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { description, amount, id, categoryId, isCashIn } = req.body;

    if (!description || !amount || !id || !categoryId) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE
        expenses
      SET
        description = '${description}',
        amount = ${amount},
        category_id = ${categoryId},
        is_cash_in = ${isCashIn}
      where
        id = ${id}
       `
    );

    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { expenseId, status } = req.body;
    if (!expenseId) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE expenses SET is_active = ${status} where "id" = '${expenseId}'`
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.approved = async (req, res) => {
  try {
    const loggedInUserId = res.locals.tokenData.id;
    const { expenseId } = req.body;
    if (!expenseId) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const query = `select
          expense.user_id as "userId",
          amount,
          is_cash_in as "isCashIn"
        from
        expenses as expense
        where "id" = ${expenseId}`;
    const response = await pool.query(query);
    const expenseData = response.rows ? response.rows[0] : null;

    const query1 = `UPDATE expenses SET is_approved = true where "id" = '${expenseId}'`;
    await pool.query(query1);

    let query2 = ` select id, date from rojmed where date::date = now()::date and user_id = ${expenseData.userId}`;
    const rojMedResponse = await pool.query(query2);
    if (rojMedResponse.rows.length === 0) {
      let query3 = `select balance from users where id = ${expenseData.userId}`;
      const userResponse = await pool.query(query3);
      const loggedInUserBalance = userResponse.rows[0].balance;

      let query4 = ` INSERT INTO rojmed (
      date, balance, expense, user_id)  VALUES (now(), ${loggedInUserBalance}, ${expenseData.amount}, ${expenseData.userId})`;
      await pool.query(query4);
    } else {
      const query5 = `update rojmed set expense = COALESCE(expense,0) + ${expenseData.amount} where user_id = ${expenseData.userId}`;
      await pool.query(query5);
    }

    if (expenseData) {
      const { userId, amount, isCashIn } = expenseData;
      let query1 = `update users set balance = balance - ${+amount}  where id = ${userId}`;
      if (isCashIn === true) {
        query1 = `update users set balance = balance + ${+amount}  where id = ${userId}`;
      }
      await pool.query(query1);

      return res.status(STATUS_CODE.SUCCESS).send();
    }

    return res
      .status(STATUS_CODE.BAD)
      .send({ message: MESSAGES.TRANSFER.INVALID_TRANSFER_ID });
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.getExpenseByUserIdInRojMed = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = `
    SELECT
     description, date, amount,
    categories.code as category_code,
    users.id as user_id,
    users.user_name as user_name
    from expenses e
     join categories as categories
      on categories.id = e.category_id
     join users as users
       on users.id = e.user_id

        where user_id = ${userId} and e.is_active = true and is_approved = true  and e.date::date = now()::date`;
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
