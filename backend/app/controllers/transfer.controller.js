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

    if (fromDate && toDate) {
      searchQuery += ` and date::date between  '${fromDate}'::date and '${toDate}'::date `;
    }
    if (fromUserId) {
      searchQuery += ` and from_user_id = ${+fromUserId} `;
    }
    if (toUserId ) {
      searchQuery += ` and to_user_id = ${+toUserId} `;
    }

    if (search) {
      searchQuery += `
        and
          (description ilike '%${search}%'
            or transfer_amount::text ilike '%${search}%'
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
            transfer_amount as transfer_amount,
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
    const { description, transfer_amount, toUserId } = req.body;
    if (!description || !transfer_amount || !toUserId) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO transfers (
        from_user_id,
        description,
        transfer_amount,
        date,
        to_user_id,
        is_approved
      )
      VALUES
        (
          ${res.locals.tokenData.id},
          '${description}',
          ${transfer_amount},
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
    const { transferId, description, transfer_amount, toUserId } = req.body;
    if (!toUserId || !description || !transfer_amount || !transferId) {
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
          transfer_amount = '${transfer_amount}',
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
    const loggedInUserId = res.locals.tokenData.id;
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
          transfer_amount
        from
        transfers
        where "id" = ${transferId}`;
    const response = await pool.query(query);
    const transferData = response.rows ? response.rows[0] : null;

    if (transferData) {
      const { fromUserId, toUserId,  transfer_amount } = transferData;


    let query11 = ` select id, date from rojmed where date::date = now()::date and user_id = ${loggedInUserId}`
    const response = await pool.query(query11);
    console.log(response.rows);

    if(response.rows.length === 0 ){
    let query12 = `select balance from users where id = ${toUserId}`
     const userResponse = await pool.query(query12);
    const loggedInUserBalance = userResponse.rows[0].balance;
    console.log(loggedInUserBalance);

     let query13 = ` INSERT INTO rojmed (
      date, balance, transfer, user_id)  VALUES (now(), ${loggedInUserBalance}, ${transfer_amount}, ${fromUserId})`
      console.log(query13);
    await pool.query(query13);

    let query17 = `select balance from users where id = ${fromUserId}`
    const toUserResponse = await pool.query(query17);
   const toUserBalance = toUserResponse.rows[0].balance;
   console.log(toUserBalance);

     let query14 = ` INSERT INTO rojmed (
      date, balance, receive, user_id)  VALUES (now(), ${toUserBalance}, ${transfer_amount}, ${toUserId})`
      console.log(query14);
    await pool.query(query14);
    } else {
      const query15 = `update rojmed set transfer = COALESCE(transfer,0) + ${transfer_amount} where user_id = ${fromUserId}`
      await pool.query(query15)

      const query16 = `update rojmed set receive = COALESCE(receive,0) + ${transfer_amount} where user_id = ${toUserId}`
      await pool.query(query16)
    }

      await pool.query(
        `update users set balance = balance - ${+transfer_amount}  where id = ${fromUserId}`
      );
      await pool.query(
        `update users set balance = balance + ${+transfer_amount}  where id = ${toUserId}`
      );
      await pool.query(
        `UPDATE transfers SET receive_amount = ${transfer_amount}, is_approved = true where "id" = '${transferId}'`
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

exports. getReceiveByUserIdInRojMed = async (req, res) =>{
  try {
    const {
     userId
    } = req.query;
    const query = `
    select
      to_user_id,
      receive_amount,
      from_user_id,
      date,
      description,
      users.user_name as from_user_name
    from
      transfers
      join users as users on users.id = from_user_id
    where
      date :: date = now() :: date
      and is_approved = true
      and transfers.to_user_id = ${userId} `
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
}
exports. getTransferByUserIdInRojMed = async (req, res) =>{
  try {
    const {
     userId
    } = req.query;
    const query = `
    select
      from_user_id,
      transfer_amount,
      date,
      description,
      to_user_id,
      date,
      description,
      users.user_name as to_user_name
    from
      transfers
      join users as users on users.id = to_user_id
    where
      date :: date = now() :: date
      and is_approved = true
      and transfers.from_user_id = ${userId}
   `
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
}

