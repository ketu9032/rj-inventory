const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');
exports.findAll = async (req, res) => {
  try {
    const { purchaseId } = req.query;
     const query = `
    SELECT
      Count(purchase_details.id) OVER() AS total,
      purchase_details.id,
      item.item_code as item_code,
      item_id,
      item_code as item_code,
        qty,
        selling_price,
        purchase_id
    FROM purchase_details
    join item as item
    on item.id = purchase_details.item_id
    where purchase_id = ${purchaseId}`;;
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
    await pool.query(`delete from purchase_details
         where "id" = '${id}'`);
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.add = async (req, res) => {
  try {
    const { item_code, qty, available, selling_price,  total, purchase_id } = req.body;
    if (!item_code || !qty|| !available|| !selling_price|| !total || !purchase_id) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO purchase_details
      (
        item_code,
        qty,
        available,
        selling_price,
        total,
        purchase_id
         )
      VALUES('${item_code}', '${qty}', '${available}', '${selling_price}', '${total}', '${purchase_id}');
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
    const { id,  item_code, qty, available, selling_price,  total, purchase_id } = req.body;
    if (!item_code || !qty|| !available|| !selling_price|| !total || !purchase_id || !id) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE purchase_details
      SET  item_code='${item_code}', qty='${qty}' , available='${available}',selling_price='${selling_price}', total='${total}', purchase_id='${purchase_id} 'where id = ${id};`
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
