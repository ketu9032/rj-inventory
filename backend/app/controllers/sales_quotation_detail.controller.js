const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');
exports.findAll = async (req, res) => {
  try {
    const {salesQuotationId} = req.query;

    const query = `
    SELECT
      Count(s.id) OVER() AS total,
        s.id,
        item.item_code as item_code,
        item_id,
        s.weight,
        s.qty,
        available,
        selling_price,
        total,
        sales_quotation_id
    FROM sales_quotation_details s
    join item as item
    on item.id = s.item_id
       where sales_quotation_id = ${salesQuotationId} `;
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
   const query = `delete from sales_quotation_details where id = ${id}`;

       await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.add = async (req, res) => {
  try {
    const { item_id, qty, available, selling_price,  total,  weight} = req.body;
    if (!item_id || !qty|| !available|| !selling_price|| !total) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO sales_quotation_details
      (
        item_id,
        qty,
        available,
        selling_price,
        total,
        weight
         )
      VALUES('${item_id}', '${qty}', '${available}', '${selling_price}', '${total}', ${weight});
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
    const { id,  item_id, qty, available, selling_price,  total } = req.body;
    if (!item_id || !qty|| !available|| !selling_price|| !total || !id) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE sales_quotation_details
      SET  item_id='${item_id}', qty='${qty}' , available='${available}',selling_price='${selling_price}', total='${total}'where id = ${id};`
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
