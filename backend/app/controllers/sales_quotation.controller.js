const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
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
           company ilike '%${search}%'
          or date ilike '%${search}%'
          or invoice_no ilike '%${search}%'
          or ref_no ilike '%${search}%'
        )`;
    }
    searchQuery += ` and i.is_active = ${active}`;
    const query = `  SELECT
      Count(id) OVER() AS total,
      id,
   company,
   date,
   invoice_no,
   ref_no
    FROM sales_quotation

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
    await pool.query(`UPDATE sales_quotation
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
      company,
      date,
      invoice_no,
      ref_no,
      sales
    } = req.body;
    if (
      !company ||
      !date ||
      !invoice_no ||
      !sales ||
      !ref_no
        ) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const insertSalesQuotationQuery = `INSERT INTO sales_quotation
    (   company,
      date,
      invoice_no,
      ref_no
      )
      VALUES('${company}','${date}', '${invoice_no}', '${ref_no}') returning id;
      `;

    const { rows } = await pool.query(insertSalesQuotationQuery);
    const salesQuotationId = rows[0].id;
    for (let index = 0; index < sales.length; index++) {
      const element = sales[index];
      const insertSalesQuotationDetailsQuery = `INSERT INTO sales_quotation_details
  (
    item_code,
    qty,
    available,
    selling_price,
    total,
    sales_quotation_id
     )
  VALUES('${element.item_code}', '${element.qty}', '${element.available}', '${element.selling_price}', '${element.total}',  '${salesQuotationId}') ;
  `;
      await pool.query(insertSalesQuotationDetailsQuery);
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
      company,
      date,
      invoice_no,
      ref_no
    } = req.body;
    if (
      !company ||
      !date ||
      !invoice_no ||
      !ref_no ||
      !id
    ) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }

    const insertSalesQuotationQuery = `UPDATE sales_quotation
    SET  company='${company}', date='${date}', invoice_no='${invoice_no}',  ref_no='${ref_no}' where id = ${id};`;
    const { updateRows } = await pool.query(insertSalesQuotationQuery);

    const UpdateSalesId = updateRows[0].id;
    for (let index = 0; index < UpdateSalesId.length; index++) {
      const element = UpdateSalesId[index];
      const insertSalesQuotationDetailsQuery = `INSERT INTO sales_quotation_details
      (   item_code,
        qty,
        available,
        selling_price,
        total
         )
      VALUES('${element.item_code}', '${element.qty}', '${element.available}', '${element.selling_price}', '${element.total}','${insertSalesQuotationDetailsQuery}') ;
      `;
      await pool.query(insertSalesQuotationDetailsQuery);
    }

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
    await pool.query(`UPDATE sales_quotation
      SET is_active = ${status} where "id" = '${id}'`);
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
