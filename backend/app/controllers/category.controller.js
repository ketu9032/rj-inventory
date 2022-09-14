const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');

exports.findAll = async (req, res) => {
  try {
    const { orderBy, direction, pageSize, pageNumber, search, active, type } =
      req.query;
    const offset = pageSize * pageNumber - pageSize;
    let searchQuery = 'where true';
    if (search) {
      searchQuery += ` and
        (code ilike '%${search}%'
          or name ilike '%${search}%'
        )`;
    }
    searchQuery += ` and is_active = ${active}`;
    if (type) {
      searchQuery += ` and type = '${type}'`;
    }
    const query = `select count(id) over() as total, id, code, name, type
    FROM categories ${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}`;
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
      `UPDATE categories SET is_deleted = true  where "id" = '${id}'`
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
    const { code, name, type } = req.body;

    if (!code || !name || !type) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO categories (code, name, type)
      VALUES('${code}', '${name}', '${type}');
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
    const { code, name, id } = req.body;

    if (!code || !name) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE categories SET code='${code}', name='${name}' where id = ${id};
       `
    );

    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.getCategoryDropDown = async (req, res) => {
  try {
    const { type } = req.query;
    if (!type) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const response = await pool.query(
      `select id, code ,name FROM categories where  is_active = true and type = '${type}' `
    );

    res.status(STATUS_CODE.SUCCESS).send(response.rows);
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
      `UPDATE categories SET is_active = ${status} where "id" = '${id}'`
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.onCheckCategoryCode = async (req, res) => {
  try {
    const { code } = req.body;
    const response = await pool.query(
      `select id from categories where lower(code) = trim(lower('${code}'))`
    );
    if (response.rowCount > 0) {
      return res.status(200).send(false);
    }
    return res.status(STATUS_CODE.SUCCESS).send(true);
  } catch (error) {
    return res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.onCheckCategoryName = async (req, res) => {
  try {
    const { name } = req.body;
    const response =
      await pool.query(`select id from categories where lower(name) = trim(lower('${name}') )
       `);
    if (response.rowCount > 0) {
      return res.status(200).send(false);
    }
    return res.status(STATUS_CODE.SUCCESS).send(true);
  } catch (error) {
    return res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
