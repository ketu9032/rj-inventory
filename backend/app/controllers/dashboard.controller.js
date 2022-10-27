const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');

exports.todaySummary = async (req, res) => {
  try {


    const query = `
    select count(id) as invoice, sum(payment) as payment from sales where date::date =  cast(now() as date)`;
    const response1 = await pool.query(query);
    let res1 = response1.rows;

    const query1 = `
    select sb.date as date,      sum(sb.sales_amount) as sales_amount,	  sum(qty) as sales_qty  from
    (select CAST(date as DATE):: date as date, sum(qty) as qty, qty * selling_price as sales_amount
      from sales_bill		  group by date, qty, selling_price
    ) as sb     where date::date =  cast(now() as date)         group by  date
    `;
    const response2 = await pool.query(query1);
    let res2 = response2.rows;

    const query3 = `

    select sum(qty * selling_price) as purchase from purchase_details where date::date =  cast(now() as date)
    `;
    const response3 = await pool.query(query3);
    let res3 = response3.rows;

    const query4 = `

select sum(amount),

(select sum(amount) as cashIn  from expenses where  date::date =  cast(now() as date) and is_cash_in = true) as cash_in,

(select sum(amount) as cashOut  from expenses where  date::date =  cast(now() as date) and is_cash_in = false) as cash_out from
 expenses   where  date::date =  cast(now() as date)
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
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
