const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');

exports.findAll = async (req, res) => {
  try {
    const { orderBy, direction, pageSize, pageNumber, search, active } =
      req.query;
    let searchQuery = 'having true';
    const offset = pageSize * pageNumber - pageSize;
    if (search) {
      searchQuery += ` and
        (
           item_code like '%${search}%'
          or item_name like '%${search}%'
          or qty_30_days::text like '%${search}%'
          or qty_15_days::text like '%${search}%'
          or qty_07_days::text like '%${search}%'
        )`;
    }
    searchQuery += ` and is_active = ${active}`;

    const query = `

    select
            sbi.item_id,
            sbi.item_name,
            sbi.item_code,
            int_qty,

            (select
              sum(qty)
            from sales_bill as sb
            where date between (now()  - interval '30 day')::date And  now()::date and sb.item_id = sbi.item_id) as qty_30_days,
            (select
              sum(qty)
            from sales_bill as sb
            where date between (now()  - interval '15 day')::date And  now()::date and sb.item_id = sbi.item_id) as qty_15_days,
            (select
              sum(qty)
            from sales_bill as sb
            where date between (now()  - interval '7 day')::date And  now()::date and sb.item_id = sbi.item_id) as qty_7_days
          from (
            select item_id, item_name,item_code, int_qty
              from sales_bill
            left join  item as item
              on  item.id = sales_bill.item_id
              group by sales_bill.item_id, item.item_name, item.item_code, item.int_qty, item.id
          ) as sbi
          `;
    // ${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}
    const response = await pool.query(query);

    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.dayWiseSalesAndProfitChart = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let whereClause = 'where ';

    if ((startDate, endDate)) {
      whereClause += `
   date :: date between ${startDate}::date
    and ${endDate}::date
    `;
    } else {
      whereClause += `date::date  = now() :: date `;
    }

    console.log(whereClause);
    const query = `
    select
    CAST(sb.date as DATE):: date,
      sum(sb.sales_amount) as sa
  from
      (
        select
          CAST(date as DATE):: date as date,
          qty * selling_price as sales_amount
        from
          sales_bill
      ) as sb

      group by  date
      `;
    // ${whereClause}
    console.log(query);
    const response1 = await pool.query(query);
    let res1 = response1.rows;

    const query1 = `
         select
         CAST(sb.date as DATE):: date,
            sum(sb.purchase_amount) as pa
          from
            (
              select
                CAST(date as DATE):: date as date,
                qty * selling_price as purchase_amount
              from
                purchase_details
            ) as sb
            group by date
            `;
    //   ${whereClause}
    console.log(query1);
    const response2 = await pool.query(query1);
    let res2 = response2.rows;
    const response = { res1, res2 };
    res.status(STATUS_CODE.SUCCESS).send(response);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.customerChart = async (req, res) => {
  try {
    const query = `
    select
    CAST(sb.date as DATE):: date,
      sum(sb.sales_amount) as sales_amount,
	  sum(qty) as sales_qty
  from
      (
        select
          CAST(date as DATE):: date as date,
		      sum(qty) as qty,
          qty * selling_price as sales_amount
        from
          sales_bill
		  group by date, qty, selling_price
      ) as sb
      where date :: date = now()::date

   group by  date
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
exports.supplierChart = async (req, res) => {
  try {
    const query = `
    select
         CAST(pd.date as DATE):: date,
            sum(pd.purchase_amount) as purchase_amount,
            sum(qty) as purchase_qty
          from
            (
              select
                CAST(date as DATE):: date as date,
                sum(qty) as qty,
                qty * selling_price as purchase_amount
              from
                purchase_details
                group by date, qty, selling_price
      ) as pd
      where date::date =  now():: date
   group by  date
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
