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
           item_code ilike '%${search}%'
          or item_name ilike '%${search}%'
          or int_qty ilike '%${search}%'
          or silver ilike '%${search}%'
          or category ilike '%${search}%'
          or supplier_name ilike '%${search}%'
          or supplier_rate ilike '%${search}%'
        )`;
    }
    searchQuery += ` and i.is_active = ${active}`;
    const query = `  SELECT
      Count(i.id) OVER() AS total,
      i.id,
      item_code,
      item_name,
      int_qty,
      comment,
      silver,
      retail,
      gold,
      india_mart,
      dealer,
      category_id as category_id,
      c.name as category_name,
      c.code as category_code
    FROM item i
     INNER JOIN categories as c  ON c.id = i.category_id
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
      silver,
      retail,
      gold,
      india_mart,
      dealer,
      suppliers,
      categoryId
    } = req.body;
    if (
      !item_code ||
      !item_name ||
      !int_qty ||
      !comment ||
      !silver ||
      !retail ||
      !gold ||
      !india_mart ||
      !dealer ||
      !suppliers ||
      !categoryId ||
      suppliers.length === 0
    ) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const insertItemQuery = `INSERT INTO item
    ( item_code,
      item_name,
      int_qty,
      comment,
      silver,
      retail,
      gold,
      india_mart,
      dealer,
      category_id
      )
      VALUES('${item_code}','${item_name}', '${int_qty}', '${comment}', '${silver}', '${retail}','${gold}','${india_mart}','${dealer}', '${categoryId}') returning id;
      `;

    console.log(insertItemQuery);
    const { rows } = await pool.query(insertItemQuery);
    const itemId = rows[0].id;
    for (let index = 0; index < suppliers.length; index++) {
      const element = suppliers[index];
      const insertSupplierQuery = `INSERT INTO item_supplier
  ( suppliers_id,
    item_supplier_rate,
    item_id
     )
  VALUES('${element.suppliers_id}', '${element.item_supplier_rate}', '${itemId}') ;
  `;
      await pool.query(insertSupplierQuery);
    }
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
      silver,
      retail,
      gold,
      india_mart,
      dealer,
      suppliers,
      categoryId
    } = req.body;
    if (
      !item_code ||
      !item_name ||
      !int_qty ||
      !comment ||
      !silver ||
      !retail ||
      !gold ||
      !india_mart ||
      !dealer ||
      !suppliers ||
      !categoryId ||
      !id
    ) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }

    const updateItemQuery = `UPDATE item
    SET  item_code='${item_code}', item_name='${item_name}', int_qty='${int_qty}',  comment='${comment}', silver='${silver}',retail='${retail}',gold='${gold}',india_mart='${india_mart}',dealer='${dealer}', category_id='${categoryId}', suppliers
    ='${suppliers}', categoryId ='${categoryId}' where id = ${id};`;
    const { updateRows } = await pool.query(updateItemQuery);

    const UpdateItemId = updateRows[0].id;
    for (let index = 0; index < UpdateItemId.length; index++) {
      const element = UpdateItemId[index];
      const updateSupplierQuery = `INSERT INTO item_supplier
      ( suppliers_id,
        item_supplier_rate,
        item_id
         )
      VALUES('${element.suppliers_id}', '${element.item_supplier_rate}','${itemId}') ;
      `;
      await pool.query(updateSupplierQuery);
    }

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
      `select id, item_code, int_qty, silver FROM item where is_active = true`
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
