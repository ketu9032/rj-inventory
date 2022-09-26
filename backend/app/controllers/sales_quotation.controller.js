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
    let searchQuery = 'having true';
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
           sr::text like '%${search}%'
          or s.date::text like '%${search}%'

          or s.qty::text like '%${search}%'
          or s.amount::text like '%${search}%'
          or total_due::text like '%${search}%'
          or shipping::text like '%${search}%'
          or gst::text like '%${search}%'
          or tier_id::text like '%${search}%'

          or remarks like '%${search}%'
          )`;
        }
        // or s.user_name ilike '%${search}%'
    searchQuery += ` and s.is_active = ${active}`;
    const query = `  SELECT
      Count(s.id) OVER() AS total,
        s.id,
        sr,
        s.date,
        s.qty,
        shipping,
        gst,
        user_id,
        users.user_name as user_name,
        remarks,
        tier_id,
        tiers.code as tier_code,
        sum(COALESCE(sqd.qty,0) * COALESCE(sqd.selling_price,0))  as amount,
        sum(COALESCE(sqd.qty,0) * COALESCE(sqd.selling_price,0)) + COALESCE(shipping,0) + COALESCE(gst,0) as total_due
      FROM sales_quotation s
       join sales_quotation_details as sqd
       on  sqd.sales_quotation_id = s.id
       JOIN tiers as tiers
        on tiers.id = s.tier_id
      join users as users
        on users.id = s.user_id
        group by
         s.id,
         s.date,
         sr,
         s.qty,
         shipping,
         gst,
         users.user_name,
         remarks,
         user_id,
         tier_id,
         tiers.code,
          s.amount,
          s.total_due,
         s.is_active
    ${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}
   `;
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
      shipping,
      gst,
      user_id,
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
        shipping,
        qty,
        gst,
        user_id,
        remarks
     )
    VALUES(now(), ${tier_id}, ${shipping}, ${qty},${gst},'${user_id}', '${remarks}') returning id;`;

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


exports.salesQuotationPrint = async (req, res) => {
  try {
    const { salesQuotationId } = req.query;
    const query = `  SELECT
    categories.name as category_name,
     categories.id as categories_id,
        s.id,
        row_number() OVER (PARTITION BY categories.id order by categories.id desc) as row_number_by_category_id,
        s.date,
        s.sr,
        user_id,
        remarks,
 	      shipping,
	    	gst,
        s.total_due as past_due,
        sales_quotation_details.item_id as sales_quotation_details_item_id,
        sales_quotation_details.qty as sales_quotation_details_qty,
        sales_quotation_details.selling_price as sales_quotation_details_selling_price,
        item.item_code as item_item_code
       FROM sales_quotation s
     join sales_quotation_details
    	 on sales_quotation_details.sales_quotation_id = s.id
     join item
   	   on sales_quotation_details.item_id = item.id
     join categories
    	 on categories.id = item.category_id
         where s.is_active = true and s.id = ${ salesQuotationId }
  order by categories.name asc `;
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
