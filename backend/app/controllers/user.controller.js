const { MESSAGES } = require('./../constant/messages');
const { STATUS_CODE } = require('./../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('./../db');

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }

    const users = await pool.query(
      `select * from users where "password" = '${password}' and user_name  = '${userName}'`
    );

    if (users.rows.length === 0) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.AUTH.USER_NOT_FOUND });
      return;
    }
    const token = generateToken(
      { password, userName },
      { expiresIn: 86400 }
    ).data;

    res.status(STATUS_CODE.SUCCESS).send({ ...users.rows[0], token });
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};


exports.findAll = async (req, res) => {
  try {
    const {orderBy, direction, pageSize, pageNumber } = req.query;

    let offset = (pageSize * pageNumber) - pageSize;

    const users = await pool.query(
      `select id ,user_name, "role", mobile_number, opening_balance, "permission", "password" from users order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}`
    );

    res.status(STATUS_CODE.SUCCESS).send(users.rows);
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
      `delete from users where "id" = '${id}'`
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
    const { userName, role, mobileNumber, openingBalance, permission, password } = req.body;

    if (!userName || !role || !mobileNumber || !openingBalance || !permission || !password) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO users
      (user_name, "role", mobile_number, opening_balance, "permission", "password")
      VALUES('${userName}', '${role}', '${mobileNumber}', '${openingBalance}', null, '${password}'); `
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
    const {  id ,userName, role, mobileNumber, openingBalance, permission, password } = req.body;
    if (!id ||!userName || !role || !mobileNumber || !openingBalance || !permission ||!password) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE users
      SET user_name='${userName}', "role"='${role}', mobile_number='${mobileNumber}', opening_balance='${openingBalance}', "permission"=null, "password"='${password}' where id = ${id};
       `
    );

   res.status(STATUS_CODE.SUCCESS).send();

  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
