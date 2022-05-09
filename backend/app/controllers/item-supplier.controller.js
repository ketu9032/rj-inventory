const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');
exports.findAll = async (req, res) => {
  try {
    const { orderBy, direction, pageSize, pageNumber, search, active, itemId } =
      req.query;
    let searchQuery = 'where true';
    const offset = pageSize * pageNumber - pageSize;
    if (search) {
      searchQuery += ` and
        (
          or supplier_company ilike '%${search}%'
          or item_supplier_rate ilike '%${search}%'
        )`;
    }
    searchQuery += ` and is_active = ${active}`;
    if (itemId) {
      searchQuery += ` and item_id = ${itemId}`;
    }
    const query = `
    SELECT
      Count(item_supplier.id) OVER() AS total,
        item_supplier.id as id,
        item_supplier_rate,
        suppliers_id as suppliers_id,
        item_id as item_id,
        s.company as supplier_name
    FROM item_supplier
      JOIN suppliers as s
        ON s.id = item_supplier.suppliers_id
${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}`;
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
    const { suppliersId, item_supplier_rate } = req.body;
    if (!suppliersId || !item_supplier_rate) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO item_supplier
      (
        suppliers_id,
        item_supplier_rate
         )
      VALUES('${suppliersId}', '${item_supplier_rate}');
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
    const { id, suppliersId, item_supplier_rate } = req.body;
    if (!suppliersId || !item_supplier_rate || !id) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE item_supplier
      SET  suppliers_id='${suppliersId}', item_supplier_rate='${item_supplier_rate}' where id = ${id};`
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
