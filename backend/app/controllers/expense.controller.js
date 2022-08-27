const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');

exports.findAll = async (req, res) => {
  try {
    const { orderBy, direction, pageSize, pageNumber, search, active } =
      req.query;
    let searchQuery = 'where true';
    const offset = pageSize * pageNumber - pageSize;
    if (search) {
      searchQuery += ` and
        (description ilike '%${search}%'
          or user_name ilike '%${search}%'
          or amount::text ilike '%${search}%'
          or date::text ilike '%${search}%'
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
    const query =   `
    INSERT INTO expenses (user_id, description, amount, date, category_id, is_cash_in)
    VALUES (${res.locals.tokenData.id}, '${description}', ${amount}, now(), ${categoryId}, ${isCashIn})
    `
    console.log(query);
    await pool.query(
      query
    );


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
    const { id, status } = req.body;
    if (!id) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE expenses SET is_active = ${status} where "id" = '${id}'`
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
