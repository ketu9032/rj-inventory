const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');

exports.findAll = async (req, res) => {
  try {
    const { orderBy, direction, pageSize, pageNumber, search, active } =
      req.query;
    const offset = pageSize * pageNumber - pageSize;
    let searchQuery = 'where true';
    if (search) {
      searchQuery += ` and
        (balance description '%${search}%'
          or company ilike '%${search}%'
          or due_limit ilike '%${search}%'
          or other ilike '%${search}%'
        )`;
    }

    searchQuery += ` and is_active = ${active}`;
    const response = await pool.query(
      `select count(id) over() as total, id, company,due_limit,balance, other from suppliers ${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}`
    );

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
      `UPDATE suppliers SET is_deleted = true where "id" = '${id}'`
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
    const { company, dueLimit, balance, other } = req.body;

    if (!company || !dueLimit || !balance || !other) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO suppliers (company, due_limit, balance, other)
      VALUES('${company}', '${dueLimit}', '${balance}', '${other}');
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
    const { company, dueLimit, balance, other, id } = req.body;

    if (!company || !dueLimit || !balance || !other || !id) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE suppliers SET company='${company}', due_limit='${dueLimit}' , balance='${balance}', other='${other}' where id = ${id};
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
      `UPDATE suppliers SET is_active = ${status} where "id" = '${id}'`
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.getSupplierDropDown = async (req, res) => {
  try {
    const response = await pool.query(
      `select id, company, due_limit, balance FROM suppliers where COALESCE(is_deleted,false) = false and is_active = true `
    );

    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.getSuppliersById = async (req, res) => {
  try {
    const { supplierId } = req.query;
    const response = await pool.query(
      `select id, company,balance,  due_limit FROM suppliers where COALESCE(is_deleted,false) = false and is_active = true  and id = ${supplierId}`
    );
    // if (response.rows && response.rows.length > 0) {
    //   return res.status(STATUS_CODE.SUCCESS).send(response.rows[0]);
    // }
    // return res.status(STATUS_CODE.ERROR).send({
    //   message: MESSAGES.COMMON.DATA_NOT_FOUND
    // });
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
