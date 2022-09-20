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
      tireId

    } = req.query;
    let searchQuery = 'where true';
    const offset = pageSize * pageNumber - pageSize;
    if (fromDate && toDate) {
      searchQuery += ` and date::date between  '${fromDate}'::date and '${toDate}'::date `;
    }
    if (tireId) {
      searchQuery += ` and tier_id = '${tireId}' `;
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
          or tier_id ilike '%${search}%'
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
      user_name,
      remarks,
      tier_id,
      tiers.code as tier_code
      FROM sales_quotation s
      full JOIN tiers as tiers
       on tiers.id = s.tier_id

     ${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}`;
   console.log(query);
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

      tier_id,
      qty,
      amount,
      total_due,
      shipping,
      gst,
      user_name,
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
        tier_id,
        qty,
        amount,
        total_due,
        shipping,
        gst,
        user_name,
        remarks
     )
    VALUES(now(), ${tier_id}, ${qty}, ${amount}, ${total_due}, ${shipping},${gst},'${user_name}', '${remarks}') returning id;`;

    console.log(insertSalesQuotationQuery);
    const { rows } = await pool.query(insertSalesQuotationQuery);
    const salesQuotationId = rows[0].id;
    for (let index = 0; index < sales.length; index++) {
      const element = sales[index];
      const insertSalesQuotationDetailsQuery = `INSERT INTO sales_quotation_details
      (
        item_id,
        qty,
        selling_price,
        sales_quotation_id
      )
        VALUES(${element.item_id}, ${element.qty},  ${element.selling_price}, ${salesQuotationId}) ;
        `;
      console.log(insertSalesQuotationDetailsQuery);
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
      qty,
      amount,
      total_due,
      shipping,
      gst,
      user_name,
      tier_id,
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
    //   !remarks ||
    //   !id
    // ) {
    //   res
    //     .status(STATUS_CODE.BAD)
    //     .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
    //   return;
    // }
    const updateSalesQuotationQuery = `UPDATE sales_quotation
    SET date= now(), qty=${qty}, amount=${amount}, total_due=${total_due},shipping=${shipping},gst=${gst}, tier_id=${tier_id}, remarks='${remarks}' where id = ${id};`;
    console.log(updateSalesQuotationQuery);
    await pool.query(updateSalesQuotationQuery);
    //
        // const { updateRows } = await pool.query(updateSalesQuotationQuery);
        // const {updateSalesQuotationId} = updateRows.length;
       for (let index = 0; index < sales.length; index++) {
         const element = sales[index];
         const updateSalesQuotationDetailsQuery = `INSERT INTO sales_quotation_details
     (
      item_id,
       qty,
       selling_price,
       sales_quotation_id
        )
        VALUES( '${element.qty}', '${element.item_id}', '${element.selling_price}', '${id}') ;
        `;

         await pool.query(updateSalesQuotationDetailsQuery);
       }
       //
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
