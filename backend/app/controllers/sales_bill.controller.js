const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');
exports.findAll = async (req, res) => {
  try {
    const { salesId } = req.query;
    const query = `
      SELECT
        Count(sales_bill.id) OVER() AS total,
          sales_bill.id,
          item.item_code as item_code,
          item_id,
          item_code as item_code,
          qty,
          selling_price,
          sales_id
      FROM sales_bill
      join item as item
      on item.id = sales_bill.item_id
      where sales_id = ${salesId}`;
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
    const { item_id, qty, available, selling_price, total } = req.body;
    if (!item_id || !qty || !available || !selling_price || !total) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO sales_bill
      (
        item_id,
        qty,
        available,
        selling_price,
        total
         )
      VALUES('${item_id}', '${qty}', '${available}', '${selling_price}', '${total}');
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
    const { id, item_id, qty, available, selling_price, total } = req.body;
    if (!item_id || !qty || !available || !selling_price || !total || !id) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE sales_bill
      SET  item_id='${item_id}', qty='${qty}' , available='${available}',selling_price='${selling_price}', total='${total}'where id = ${id};`
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
