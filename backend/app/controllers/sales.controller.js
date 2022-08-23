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
           no::text ilike '%${search}%'
          or s.date::text ilike '%${search}%'
          or invoice_no::text ilike '%${search}%'
          or qty::text ilike '%${search}%'
          or amount::text ilike '%${search}%'
          or total_due::text ilike '%${search}%'
          or grand_total::text ilike '%${search}%'
          or user_name ilike '%${search}%'
          or tier ilike '%${search}%'
          or remarks ilike '%${search}%'
          or customer ilike '%${search}%'
          or payment::text ilike '%${search}%'
          or pending_due::text ilike '%${search}%'
          or amount_pd_total::text ilike '%${search}%'
          or other_payment::text ilike '%${search}%'
          or token::text ilike '%${search}%'
        )`;
    }
    searchQuery += ` and s.is_active = ${active}`;
    const query = `  SELECT
      Count(s.id) OVER() AS total,
      s.id,
      no,
      s.date,
      invoice_no,
      qty,
      amount,
      total_due,
      tier,
      grand_total,
      user_name,
      remarks,
      payment,
      customer,
      pending_due,
      other_payment,
      amount_pd_total,
      token
      FROM sales s
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
    const {
      invoice_no,
      qty,
      amount,
      total_due,
      user_name,
      pending_due,
      grand_total,
      tier,
      remarks,
      sales,
      payment,
      customer,
      other_payment,
      amount_pd_total,
      token
    } = req.body;
    // if (
    //   !date ||
    //   !invoice_no ||
    //   !qty ||
    //   !amount ||
    //   !total_due ||
    //   !user_name ||
    //   !tier ||
    //   !sales ||
    //   !remarks
    // ) {
    //   res
    //     .status(STATUS_CODE.BAD)
    //     .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
    //   return;
    // }

    const insertSalesQuotationQuery = `INSERT INTO sales
    (
       date,
       invoice_no,
       qty,
       amount,
       total_due,
       pending_due,
       user_name,
       grand_total,
       tier,
       remarks,
       payment,
       customer,
       other_payment,
       amount_pd_total,
       token
     )
    VALUES(now(), '${invoice_no}', '${qty}', '${amount}', '${total_due}','${pending_due}', '${user_name}', '${grand_total}', '${tier}', '${remarks}', '${payment}', '${customer}', '${other_payment}', '${amount_pd_total}', ) returning id;`;

    console.log(insertSalesQuotationQuery);
    const { rows } = await pool.query(insertSalesQuotationQuery);
    const salesId = rows[0].id;
    for (let index = 0; index < sales.length; index++) {
      const element = sales[index];
      const insertSalesQuotationDetailsQuery = `INSERT INTO sales_bill
      (
        item_code,
        qty,
        available,
        selling_price,
        total,
        sales_id
        )
        VALUES('${element.item_code}', '${element.qty}', '${element.available}', '${element.selling_price}', '${element.total}',  '${salesId}') ;
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

exports.addSales = async (req, res) => {
  try {
    const {
      invoice_no,
      qty,
      amount,
      total_due,
      user_name,
      tier,
      remarks,
      pending_due,
      customer,
      amount_pd_total
    } = req.body;
    // if (
    //   !date ||
    //   !invoice_no ||
    //   !qty ||
    //   !amount ||
    //   !total_due ||
    //   !user_name ||
    //   !tier ||
    //   !sales ||
    //   !remarks
    // ) {
    //   res
    //     .status(STATUS_CODE.BAD)
    //     .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
    //   return;
    // }
    const insertSalesQuotationQuery = `INSERT INTO sales
    (
       date,
       invoice_no,
       qty,
       amount,
       total_due,
       user_name,
       tier,
       remarks,
       pending_due,
       customer,
       amount_pd_total,
       token
     )
    VALUES(now(), '${invoice_no}', '${qty}', '${amount}', '${total_due}','${user_name}', '${tier}', '${remarks}', '${pending_due}', '${customer}', '${amount_pd_total}',(select count(token)+1 from sales  where date::date = now()::date)
    )`;
    await pool.query(insertSalesQuotationQuery);
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id, date, invoice_no, ref_no, companyId } = req.body;
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
