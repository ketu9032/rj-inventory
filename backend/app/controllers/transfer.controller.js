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
      fromUserId,
      toUserId
    } = req.query;
    let searchQuery = 'where true';
    const offset = pageSize * pageNumber - pageSize;

    if (res.locals.tokenData.role === 'Employees') {
      searchQuery += ` and from_user_id  = ${res.locals.tokenData.id} or to_user_id =  ${res.locals.tokenData.id}`;
    }

    if (fromDate != 'undefined' && toDate != 'undefined') {
      searchQuery += ` and date  between   '${fromDate }' and  '${toDate}' `;
    }
    if (fromUserId != 'undefined' && toUserId != 'undefined') {
      searchQuery += ` and  from_user_id = ${+fromUserId} and to_user_id = ${+toUserId} `;
    }

    if (search) {
      searchQuery += `
        and
          (description ilike '%${search}%'
            or amount::text ilike '%${search}%'
            or date::text ilike '%${search}%'
            or to_user.user_name ilike '%${search}%'
            or from_user.user_name ilike '%${search}%'
          )
       `;
    }
    searchQuery += ` and t.is_active = ${active}`;

    let query = `
          select
            count(t.id) over() as total,
            t.id as "transferId",
            description as description,
            t.is_deleted as "isDeleted",
            amount as amount,
            t.to_user_id as "toUserId",
            to_user.user_name as "toUserName",
            t.date as "transferDate",
            t.from_user_id as "fromUserId",
            from_user.user_name as "fromUserName",
            t.is_approved as "isApproved",
            t.is_active as "isActive"
          FROM
            transfers t
            join users to_user on to_user.id = t.to_user_id
            join users from_user on from_user.id = t.from_user_id
            ${searchQuery}
            order by ${orderBy} ${direction}
            OFFSET ${offset} LIMIT ${pageSize}`;

    console.log(query);
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
      `UPDATE transfers SET is_deleted = true  where "id" = '${id}'`
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
    const { description, amount, toUserId } = req.body;
    if (!description || !amount || !toUserId) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO transfers (
        from_user_id,
        description,
        amount,
        date,
        to_user_id,
        is_approved
      )
      VALUES
        (
          ${res.locals.tokenData.id},
          '${description}',
          ${amount},
          'now()',
          ${toUserId},
          false
        )
      `
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
    const { transferId, description, amount, toUserId } = req.body;
    if (!toUserId || !description || !amount || !transferId) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE transfers
        SET
          to_user_id = '${toUserId}',
          description = '${description}',
          amount = '${amount}',
          date = 'now()'
        where
          id = ${transferId};
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
    const { transferId, status } = req.body;
    if (!transferId) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE transfers SET is_active = ${status} where "id" = '${transferId}'`
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
    const { transferId } = req.body;
    if (!transferId) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const query = `select
          from_user_id as "fromUserId",
          to_user_id as "toUserId",
          amount
        from
        transfers
        where "id" = ${transferId}`;
    const response = await pool.query(query);
    const transferData = response.rows ? response.rows[0] : null;

    if (transferData) {
      const { fromUserId, toUserId, amount } = transferData;
      await pool.query(
        `update users set balance = balance - ${+amount}  where id = ${fromUserId}`
      );
      await pool.query(
        `update users set balance = balance + ${+amount}  where id = ${toUserId}`
      );
      await pool.query(
        `UPDATE transfers SET is_approved = true where "id" = '${transferId}'`
      );
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
