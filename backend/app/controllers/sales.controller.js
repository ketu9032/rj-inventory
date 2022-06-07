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
      (company ilike '%${search}%'
        or date ilike '%${search}%'
        or invoice_no ilike '%${search}%'
        )`;
    }
    searchQuery += ` and s.is_active = ${active}`;
    const response = await pool.query(
      `
          SELECT
              Count(s.id) OVER() AS total,
              s.id,
              s.date
              invoice_no,
              ref_no,
              company_id as company_id,
              c.name as customer_name
          FROM
              sales s
              INNER JOIN cdf as c on c.id  = s.company_id
          ${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}`
    );
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
    await pool.query(
      `UPDATE sales SET is_deleted = true  where "id" = '${id}'`
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.add = async (req, res) => {
  try {
    const { date, invoice_no, ref_no, sales, companyId } = req.body;
    if (!date || !invoice_no || !ref_no || !sales || !companyId) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const insertSalesQuery = `INSERT INTO sales (
         date,
        invoice_no,
        ref_no,
        company_id)
      VALUES('${date}','${invoice_no}','${ref_no}', '${companyId}' ) returning id;
      `;
    console.log(insertSalesQuery);
    const { rows } = await pool.query(insertSalesQuery);
    const salesId = rows[0].id;
    for (let index = 0; index < sales.length; index++) {
      const element = sales[index];
      const insertSalesBillQuery = `INSERT INTO sales_bill
  ( item_code,
    selling_price,
    qty,
    available,
    total,
    sales_id
     )
  VALUES('${element.item_code}', '${element.selling_price}',
  '${element.qty}','${element.available}','${element.total}', '${salesId}') ;
  `;
      await pool.query(insertSalesBillQuery);
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
      date,
      invoice_no,
      ref_no,
      companyId
    } = req.body;
    if (!id || !date || !invoice_no || !ref_no || !companyId) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE sales SET date='${date}',invoice_no='${invoice_no}', ref_no='${ref_no}', company_id='${companyId}' where id = ${id};
       `
    );
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
    await pool.query(
      `UPDATE sales SET is_active = ${status} where "id" = '${id}'`
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
