const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');
const { dateWiseSalesSearch } = require('./sales.controller');
// exports.findAll = async (req, res) => {
//   try {
// const  { date } = req.query
//     let response
//     const getUserQuery = ` SELECT id FROM users`
//     const responseUserId = await pool.query(getUserQuery);
//     for (let index = 0; index < responseUserId.rows.length; index++) {
//       const element = responseUserId.rows[index].id;
//       let balanceQuery = '';
//        balanceQuery = `SELECT  balance, id,user_name, sale_amount, receive_amount, transfer_amount, expenses_amount, purchase_amount
//       FROM users as users
//     left join
//       (select user_id, SUM(payment) as sale_amount from sales
//       where date::date = now()::date group by sales.user_id) as sales
//        on sales.user_id =  users.id
//     left join
//        (select to_user_id, SUM(receive_amount) as receive_amount from transfers
//        where  date::date = now()::date  and is_approved = true group by transfers.to_user_id) as transfers_receive
//        on transfers_receive.to_user_id = users.id
//     left  join
//      (select from_user_id,  SUM(transfer_amount) as transfer_amount from transfers
//       where  date::date = now()::date  and is_approved = true group by transfers.from_user_id) as transfers
//        on transfers.from_user_id =  users.id
//     left join
//       (select user_id,  SUM(amount) as expenses_amount from expenses
//       where date::date = now()::date  group by expenses.user_id) as expenses
//        on expenses.user_id = users.id
//     left join
//       (select user_id, SUM(payment) as purchase_amount from purchase
//        where  date::date = now()::date group by purchase.user_id) as purchase
//     on purchase.user_id = users.id
//       `
//       console.log(balanceQuery);
//        response =   await pool.query(balanceQuery)
//       }
//       res.status(STATUS_CODE.SUCCESS).send(response.rows);
//   } catch (error) {
//     res.status(STATUS_CODE.ERROR).send({
//       message: error.message || MESSAGES.COMMON.ERROR
//     });
//   }
// };


exports.findAll = async (req, res) => {
  try {
const  { date } = req.query
   const query = `SELECT
    user_id,
    date,
    r.balance,
    sale,
    users.user_name as user_name,
    expense,
    receive,
    purchase,
    transfer

    from rojmed as r
    join users as users
     on users.id = r.user_id
    `
    let response = await pool.query(query)


      res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};


