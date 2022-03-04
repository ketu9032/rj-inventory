const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');

exports.findAll = async (req, res) => {
  try {
    const { orderBy, direction, pageSize, pageNumber, search } = req.query;
    let searchQuery = 'where true';
    if (search) {
      searchQuery += ` and
        (code ilike '%${search}%'
          or name ilike '%${search}%'
        )`;
    }

    let offset = pageSize * pageNumber - pageSize;

    const users = await pool.query(
      `select count(id) over() as total, id, code, name
      FROM tiers ${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}`
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
    await pool.query(`delete from tiers where "id" = '${id}'`);
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.add = async (req, res) => {
  try {
    const { code, name } = req.body;

    if (!code || !name) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO tiers
      (code, name, address, email, mobile_no, due_limit, balance, other, tier)
      VALUES('${code}', '${name}');
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
    const { code, name } = req.body;

    if (!code || !name) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE tiers
      SET code='${code}', name='${name}' where id = ${id};
       `
    );

    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
