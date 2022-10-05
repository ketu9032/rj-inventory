const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { pool } = require('../db');
exports.findAll = async (req, res) => {
  try {
    const {
      orderBy,
      direction,
      pageSize,
      pageNumber,
      search,
      active,
      fromDate,
      toDate,
      categoryId,
      supplierId
    } = req.query;
    let searchQuery = 'where true';

    if (fromDate && toDate) {
      searchQuery += ` and date::date between  '${fromDate}'::date and '${toDate}'::date `;
    }
    if (categoryId) {
      searchQuery += ` and category_id = ${+categoryId} `;
    }
    if (supplierId) {
      searchQuery += ` and item.suppliers_id = ${+supplierId} `;
    }
    const offset = pageSize * pageNumber - pageSize;

    if (search) {
      searchQuery += ` and
        (
           item_code::text like '%${search}%'
          or date::text like '%${search}%'
          or item_name::text like '%${search}%'
          or int_qty::text like '%${search}%'
          or COALESCE(item_sold,0)::text like '%${search}%'
          or COALESCE(item_purchased,0)::text like '%${search}%'
          or silver::text like '%${search}%'


        )`;
    }
    searchQuery += ` and i.is_active = ${active}`;
    const query = `  SELECT
      Count(i.id) OVER() AS total,
      i.id,
      item_code,
      item_name,
      int_qty,
      COALESCE(item_purchased,0) as item_purchased,
      COALESCE(item_sold,0) as item_sold ,
      COALESCE(int_qty,0) +  COALESCE(item_purchased,0) -  COALESCE(item_sold,0) as item_available,
      (COALESCE(int_qty,0) +  COALESCE(item_purchased,0) -  COALESCE(item_sold,0)) * silver as item_price_total,
      comment,
      silver,
      retail,
      gold,
      india_mart,
      dealer,
      weight,
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
      categoryId,
      weight
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
      !weight ||
      suppliers.length === 0
    ) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const insertItemQuery = `INSERT INTO item
    ( date,
      item_code,
      item_name,
      int_qty,
      comment,
      silver,
      retail,
      gold,
      india_mart,
      dealer,
      category_id,
      item_purchased,
      item_sold,
      weight
        )
      VALUES(now(), '${item_code}','${item_name}', ${int_qty}, '${comment}', ${silver}, ${retail}, ${gold}, ${india_mart}, ${dealer},  '${categoryId}', 0 , 0, ${weight}) returning id;
      `;

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
      categoryId,
      weight
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
      !weight ||
      !id
    ) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }

    const updateItemQuery = `
    UPDATE
    item
  SET
    item_code = '${item_code}',
    item_name = '${item_name}',
    int_qty = ${int_qty},
    comment = '${comment}',
    silver = ${silver},
    retail = ${retail},
    gold = ${gold},
    india_mart = ${india_mart},
    dealer = ${dealer},
    category_id = ${categoryId},
    weight = ${weight},
    date = now()
  where
    id = ${id}`;
    const updateRows = await pool.query(updateItemQuery);
    for (let index = 0; index < suppliers.length; index++) {
      const element = suppliers[index];
      let updateSupplierQuery = `INSERT INTO item_supplier
      (
        suppliers_id,
        item_supplier_rate,
        item_id
      )
      VALUES(${element.suppliers_id}, ${element.item_supplier_rate},${id}) ;
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
      `select id, item_code, int_qty, item_purchased, item_sold,weight, silver FROM item where is_active = true`
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

exports.onCheckItemCode = async (req, res) => {
  try {
    const { itemCode } = req.body;
    const response =
      await pool.query(`select id from item where lower(item_code) = trim(lower('${itemCode}'))
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
