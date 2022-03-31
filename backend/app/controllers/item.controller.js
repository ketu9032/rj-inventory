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
        (company ilike '%${search}%'
          or item_code ilike '%${search}%'
          or item_name ilike '%${search}%'
          or int_qty ilike '%${search}%'
          or purchased ilike '%${search}%'
          or sold ilike '%${search}%'
          or available ilike '%${search}%'
          or silver ilike '%${search}%'
          or total ilike '%${search}%'
          or supplier_name ilike '%${search}%'
          or supplier_qty ilike '%${search}%'
          or supplier_rate ilike '%${search}%'
        )`;
    }
    searchQuery += ` and is_active = ${active}`;
    const query = `  SELECT
    Count(id) OVER() AS total,
    id,
    item_code,
        item_name,
        int_qty,
        comment,
        purchased,
        sold,
        available,
        silver,
        retail,
        gold,
        india_mart,
        dealer,
        total,
        supplier_name,
        supplier_qty,
        supplier_rate
    FROM item
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
    await pool.query(`UPDATE item
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
    const {
      item_code,
      item_name,
      int_qty,
      comment,
      purchased,
      sold,
      available,
      silver,
      retail,
      gold,
      india_mart,
      dealer,
      total,
      supplier_name,
      supplier_qty,
      supplier_rate
    } = req.body;

    if (
      !item_code ||
      !item_name ||
      !int_qty ||
      !comment ||
      !purchased ||
      !sold ||
      !available ||
      !sliver ||
      !retail ||
      !gold ||
      !india_mart ||
      !dealer ||
      !total ||
      !supplier_name ||
      !supplier_qty ||
      !supplier_rate
    ) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO item
      ( item_code,
        item_name,
        int_qty,
        comment,
        purchased,
        sold,
        available,
        silver,
        retail,
        gold,
        india_mart,
        dealer,
        total,
        supplier_name,
        supplier_qty,
        supplier_rate,
         )
      VALUES('${item_code}','${item_name}', '${int_qty}', '${comment}', '${purchased}', '${sold}', '${available}', '${silver}', '${retail}','${gold}','${india_mart}','${dealer}','${total}','${supplier_name}','${supplier_qty}', '${supplier_rate}');
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
    const {
      id,
      item_code,
      item_name,
      int_qty,
      comment,
      purchased,
      sold,
      available,
      silver,
      retail,
      gold,
      india_mart,
      dealer,
      total,
      supplier_name,
      supplier_qty,
      supplier_rate
    } = req.body;
    if (
      !item_code ||
      !item_name ||
      !int_qty ||
      !comment ||
      !purchased ||
      !sold ||
      !available ||
      !silver ||
      !retail ||
      !gold ||
      !india_mart ||
      !dealer ||
      !total ||
      !supplier_name ||
      !supplier_qty ||
      !supplier_rate ||
      !id
    ) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE item
      SET company='${company}', code='${code}', name='${name}', int_qty='${int_qty}',  comment='${comment}',purchased='${purchased}', sold='${sold}', available='${available}', silver='${silver}',retail='${retail}',gold='${gold}',india_mart='${india_mart}',dealer='${dealer}', total='${total}', supplier_name='${supplier_name}', supplier_qty='${supplier_qty}',supplier_rate='${supplier_rate}' where id = ${id};`
    );

    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.getItemDropDown = async (req, res) => {
  try {
    const response = await pool.query(
      `select id, company FROM item where is_deleted = false and is_active = true`
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
    await pool.query(`UPDATE item
      SET is_active = ${status} where "id" = '${id}'`);
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
