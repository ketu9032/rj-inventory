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
      toDate
    } = req.query;
    let searchQuery = 'where true';
    const offset = pageSize * pageNumber - pageSize;
    if (fromDate && toDate) {
      searchQuery += ` and date::date between  '${fromDate}'::date and '${toDate}'::date `;
    }
    if (search) {
      searchQuery += ` and
        (
           sr::text ilike '%${search}%'
          or s.date::text ilike '%${search}%'
          or invoice_no::text ilike '%${search}%'
          or qty::text ilike '%${search}%'
          or amount::text ilike '%${search}%'
          or total_due::text ilike '%${search}%'
          or shipping::text ilike '%${search}%'
          or gst::text ilike '%${search}%'
          or user_name ilike '%${search}%'
          or tier ilike '%${search}%'
          or remarks ilike '%${search}%'
        )`;
    }
    searchQuery += ` and s.is_active = ${active}`;
    const query = `  SELECT
      Count(s.id) OVER() AS total,
      s.id,
      sr,
      s.date,
      invoice_no,
      qty,
      amount,
      total_due,
      shipping,
      gst,
      tier,
      user_name,
      remarks
      FROM sales_quotation s
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
    const query = ` delete from sales_quotation where id = ${id}`;
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
    const {
      date,
      invoice_no,
      qty,
      amount,
      total_due,
      shipping,
      gst,
      user_name,
      tier,
      remarks,
      sales
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
    const insertSalesQuotationQuery = `INSERT INTO sales_quotation
    (
       date,
       invoice_no,
       qty,
       amount,
       total_due,
       shipping,
       gst,
       user_name,
       tier,
       remarks
     )
    VALUES('${date}', '${invoice_no}', '${qty}', '${amount}', '${total_due}', '${shipping}','${gst}','${user_name}', '${tier}', '${remarks}') returning id;`;
    const { rows } = await pool.query(insertSalesQuotationQuery);
    const salesQuotationId = rows[0].id;
    for (let index = 0; index < sales.length; index++) {
      const element = sales[index];
      const insertSalesQuotationDetailsQuery = `INSERT INTO sales_quotation_details
      (item_code,
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
      date,
      invoice_no,
      qty,
      amount,
      total_due,
      shipping,
      gst,
      user_name,
      tier,
      remarks
    } = req.body;
    // if (
    //   !date ||
    //   !invoice_no ||
    //   !qty ||
    //   !amount ||
    //   !total_due ||
    //   !user_name ||
    //   !tier ||
    //   !remarks ||
    //   !id
    // ) {
    //   res
    //     .status(STATUS_CODE.BAD)
    //     .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
    //   return;
    // }
    const updateSalesQuotationQuery = `UPDATE sales_quotation
    SET date='${date}', invoice_no='${invoice_no}', qty='${qty}', amount='${amount}', total_due='${total_due}',shipping='${shipping}',gst='${gst}', user_name='${user_name}', tier='${tier}', remarks='${remarks}' where id = ${id};`;
    await pool.query(updateSalesQuotationQuery);
    //     const { updateRows } = await pool.query(updateSalesQuotationQuery);
    //     const {updateSalesQuotationId} = updateRows.length;
    //    for (let index = 0; index < updateSalesQuotationId.length; index++) {
    //      const element = updateSalesQuotationId[index];
    //      const updateSalesQuotationDetailsQuery = `INSERT INTO sales_quotation_details
    //  (
    //    qty,
    //    available,
    //    selling_price,
    //    total,
    //    sales_quotation_id
    //     )
    //     VALUES( '${element.qty}', '${element.available}', '${element.selling_price}', '${element.total}',  '${salesQuotationId}') ;
    //     `;
    //     // item_code,'${element.item_code}',
    //      await pool.query(updateSalesQuotationDetailsQuery);
    //    }
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
