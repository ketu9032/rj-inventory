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
        (
          or supplier_name ilike '%${search}%'
          or supplier_qty ilike '%${search}%'
          or supplier_rate ilike '%${search}%'
        )`;
    }
    searchQuery += ` and is_active = ${active}`;
    const query = `  SELECT
    Count(id) OVER() AS total,
        id,
        supplier_qty,
        supplier_rate,
        supplier_id as supplier_id,
    FROM item_supplier
      JOIN suppliers as s ON s.id = item_supplier.id
${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}`;
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
    await pool.query(`UPDATE item_supplier
        SET is_deleted = true where "id" = '${id}'`);
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.add = async (req, res) => {
  try {
    const { supplier_name, supplier_qty, supplier_rate } = req.body;

    if (!supplier_name || !supplier_qty || !supplier_rate) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO item_supplier
      (
        supplier_name,
        supplier_qty,
        supplier_rate
         )
      VALUES('${supplier_name}','${supplier_qty}', '${supplier_rate}');
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
    const { id, supplier_name, supplier_qty, supplier_rate } = req.body;
    if (!supplier_name || !supplier_qty || !supplier_rate || !id) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE item_supplier
      SET  supplier_name='${supplier_name}', supplier_qty='${supplier_qty}',supplier_rate='${supplier_rate}' where id = ${id};`
    );

    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
