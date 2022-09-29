const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');
const { dateWiseSalesSearch } = require('./sales.controller');



exports.findAll = async (req, res) => {
  try {

    let data = []
    const getUserQuery = ` SELECT id, balance FROM users`
    const response = await pool.query(getUserQuery);

    for (let index = 0; index < response.rows.length; index++) {
      const element = response.rows[index].id;
      console.log(element);

      const balanceQuery = ` SELECT  balance FROM users where id = ${element}`
       let res = await pool.query(balanceQuery);
       data.push(res.rows)

      const saleQuery = `select user_id, SUM(payment) from sales where user_id = ${element} and date::date = now()::date group by sales.user_id`
      res = await pool.query(saleQuery);
      data.push(res.rows)

      const receivedQuery = `select to_user_id, SUM(amount) from transfers where from_user_id =  ${element} and date::date  = now()::date group by transfers.to_user_id`
      res = await pool.query(receivedQuery);
      data.push(res.rows)

      const transferQuery = `select from_user_id, SUM(amount) from transfers where to_user_id =  ${element} and date::date  = now()::date group by transfers.from_user_id`
       res = await pool.query(transferQuery);
       data.push(res.rows)

      const expensesQuery = `select user_id, SUM(amount) from expenses where user_id =  ${element} and date::date = now()::date  group by expenses.user_id`
      res = await pool.query(expensesQuery);
      data.push(res.rows)

      const purchaseQuery = `select user_id, SUM(payment) from purchase where user_id =  ${element} and date::date = now()::date  group by purchase.user_id`
      res = await pool.query(purchaseQuery);
      data.push(res.rows)

      console.log(data);

    }





  res.status(STATUS_CODE.SUCCESS).send(data);

  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
