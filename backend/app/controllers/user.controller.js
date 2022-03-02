const { MESSAGES } = require('./../constant/messages');
const { STATUS_CODE } = require('./../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('./../db');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }

    const users = await pool.query(
      `select * from users where "password" = '${password}' and username  = '${username}'`
    );

    if (users.rows.length === 0) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.AUTH.USER_NOT_FOUND });
      return;
    }
    const token = generateToken(
      { password, username },
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
    const users = await pool.query(
      `select id ,username, "role", mobilenumber, openingbalance, "permission", "password" from users order by id desc `
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
    const { username, role, mobilenumber, openingbalance, permission, password } = req.body;

    if (!username || !role || !mobilenumber || !openingbalance || !permission || !password) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO users
      (username, "role", mobilenumber, openingbalance, "permission", "password")
      VALUES('${username}', '${role}', '${mobilenumber}', '${openingbalance}', null, '${password}'); `
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
    const {  id ,username, role, mobilenumber, openingbalance, permission, password } = req.body;
    if (!id ||!username || !role || !mobilenumber || !openingbalance || !permission ||!password) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE users
      SET username='${username}', "role"='${role}', mobilenumber='${mobilenumber}', openingbalance='${openingbalance}', "permission"=null, "password"='${password}' where id = ${id};
       `
    );

   res.status(STATUS_CODE.SUCCESS).send();

  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
