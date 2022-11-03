const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');

exports.todaySummary = async (req, res) => {
  try {

    let whereClause = `where date::date =  cast(now() as date)`;
    const query = `
      select count(id) as invoice, sum(payment) as payment from sales
      ${whereClause}`;
    const response1 = await pool.query(query);
    let res1 = response1.rows;

    const query1 = `
      select sb.date as date,      sum(sb.sales_amount) as sales_amount,	  sum(qty) as sales_qty  from
         (select CAST(date as DATE):: date as date, sum(qty) as qty, qty * selling_price as sales_amount
        from sales_bill		  group by date, qty, selling_price
         ) as sb  ${whereClause}       group by  date
    `;
    const response2 = await pool.query(query1);
    let res2 = response2.rows;

    const query3 = `
       select sum(qty * selling_price) as purchase from purchase_details  ${whereClause}
    `;
    const response3 = await pool.query(query3);
    let res3 = response3.rows;

    const query4 = `
    select sum(amount),
      (select sum(amount) as cashIn  from expenses  ${whereClause} and is_cash_in = true) as cash_in,
      (select sum(amount) as cashOut  from expenses   ${whereClause} and is_cash_in = false) as cash_out from
    expenses    ${whereClause}
    `;
    const response4 = await pool.query(query4);
    let res4 = response4.rows;

    const response = { res1, res2, res3, res4 };
    res.status(STATUS_CODE.SUCCESS).send(response);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.monthWiseData = async (req, res) => {
  try {
    let whereClause = `where   date::date between CAST (now() - interval '30 day' as DATE):: date
    And CAST (now() as DATE):: date`;

    const query = `
      select count(id) as invoice, sum(payment) as payment from sales ${whereClause}`;
    const response1 = await pool.query(query);
    let res1 = response1.rows;

    const query1 = `
    select sb.date as date,      sum(sb.sales_amount) as sales_amount,	  sum(qty) as sales_qty  from
    (select CAST(date as DATE):: date as date, sum(qty) as qty, qty * selling_price as sales_amount
   from sales_bill		  group by date, qty, selling_price
    ) as sb  ${whereClause}       group by  date
    `;
    const response2 = await pool.query(query1);
    let res2 = response2.rows;

    const query3 = `
       select sum(qty * selling_price) as purchase from purchase_details ${whereClause}
    `;
    const response3 = await pool.query(query3);
    let res3 = response3.rows;

    const query4 = `
    select sum(amount),
      (select sum(amount) as cashIn  from expenses  ${whereClause}  and is_cash_in = true) as cash_in,
      (select sum(amount) as cashOut  from expenses  ${whereClause}  and is_cash_in = false) as cash_out from
    expenses  ${whereClause}
    `;
    const response4 = await pool.query(query4);
    let res4 = response4.rows;

    const response = { res1, res2, res3, res4 };
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
        customer_id,
        customer_sales,
        sales_bill.date,
        cdf.company
      from
        sales as sales
        left join (
          select
            sales_id,
            date,
            qty * selling_price as customer_sales
          from
            sales_bill
          where
            date :: date between CAST (now() - interval '30 day' as DATE):: date
            And CAST (now() as DATE):: date
        ) as sales_bill on sales_bill.sales_id = sales.id
        left join cdf as cdf on cdf.id = sales.customer_id

          `;
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
          suppliers_id,
          purchase_sales,
          purchase_details.date,
          suppliers.company
        from
          purchase as purchase
          left join (
            select
              purchase_id,
              date,
              qty * selling_price as purchase_sales
            from
              purchase_details
            where
              date :: date between CAST (now() - interval '30 day' as DATE):: date
              And CAST (now() as DATE):: date
          ) as purchase_details on purchase_details.purchase_id = purchase.id
          left join suppliers as suppliers on suppliers.id = purchase.suppliers_id
          `;
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.companyBalance = async (req, res) => {
  try {


    const query = `
    select sum(balance) as user_balance from users`
    const response1 = await pool.query(query);
    let res1 = response1.rows;

    const query1 = `
    select  sum(cdf_total_due) as cdf_remaining_balance  from cdf`;
    const response2 = await pool.query(query1);
    let res2 = response2.rows;

    const query3 = `
    select  sum((int_qty + item_purchased - item_sold) * silver) as sales_stock from item`;
    const response3 = await pool.query(query3);
    let res3 = response3.rows;

    const query4 = `
    select sum(suppliers_total_due) as supplier_due from suppliers `;
    const response4 = await pool.query(query4);
    let res4 = response4.rows;

    const response = { res1, res2, res3, res4 };
    res.status(STATUS_CODE.SUCCESS).send(response);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
