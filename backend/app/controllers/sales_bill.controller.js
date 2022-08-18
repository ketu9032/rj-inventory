const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');
exports.findAll = async (req, res) => {
  try {
    const { orderBy, direction, pageSize, pageNumber, search, active, salesQuotationId } =
      req.query;
    let searchQuery = 'where true';
    const offset = pageSize * pageNumber - pageSize;
    if (search) {
      searchQuery += ` and
        (
          or item_code ilike '%${search}%'
          or qty::text ilike '%${search}%'
          or available::text ilike '%${search}%'
          or selling_price::text ilike '%${search}%'
          or total::text ilike '%${search}%'
        )`;
    }
    searchQuery += ` and is_active = ${active}`;
    if (salesQuotationId) {
      searchQuery += ` and sales_id = ${salesQuotationId}`;
    }
    const query = `
    SELECT
      Count(sales_bill.id) OVER() AS total,
        id,
        item_code,
        qty,
        available,
        selling_price,
        total,
        sales_id
    FROM sales_bill

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
    await pool.query(`UPDATE sales_quotation_details
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
    const { item_code, qty, available, selling_price,  total } = req.body;
    if (!item_code || !qty|| !available|| !selling_price|| !total) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO sales_bill
      (
        item_code,
        qty,
        available,
        selling_price,
        total
         )
      VALUES('${item_code}', '${qty}', '${available}', '${selling_price}', '${total}');
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
    const { id,  item_code, qty, available, selling_price,  total } = req.body;
    if (!item_code || !qty|| !available|| !selling_price|| !total || !id) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE sales_bill
      SET  item_code='${item_code}', qty='${qty}' , available='${available}',selling_price='${selling_price}', total='${total}'where id = ${id};`
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
