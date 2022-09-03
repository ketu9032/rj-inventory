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
          s.id::text ilike '%${search}%'
          or s.date::text ilike '%${search}%'
          or bill_no::text ilike '%${search}%'
          or users.user_name ilike '%${search}%'
          or tier ilike '%${search}%'
          or remarks ilike '%${search}%'
          or cdf.company ilike '%${search}%'
          or payment::text ilike '%${search}%'
          or COALESCE(past_due,0)::text ilike '%${search}%'
          or other_payment::text ilike '%${search}%'
          or token::text ilike '%${search}%'
        )`;
    }
    searchQuery += ` and s.is_active = ${active}`;
    const query = `  SELECT
        Count(s.id) OVER() AS total,
        s.id as id,
        s.date,
        bill_no,
        tier,
        users.user_name as user_name,
        remarks,
        s.payment as payment,
        customer_id,
        cdf.company as customer_name,
        cdf.due_limit as cdf_due_limit,
        other_payment as other_payment,
        token,
        COALESCE(past_due,0) as past_due,
        sum(COALESCE(sales_bill.qty,0) * COALESCE(sales_bill.selling_price,0)) + COALESCE(past_due,0) as total_amount,
        sum(COALESCE(sales_bill.qty,0) * COALESCE(sales_bill.selling_price,0)) as amount,
        sum(COALESCE(sales_bill.qty,0) * COALESCE(sales_bill.selling_price,0)) + COALESCE(past_due,0) - s.payment as total_due
      FROM sales s
      join cdf as cdf
        on cdf.id = s.customer_id
      join users as users
        on users.id = s.user_id
      left join sales_bill
      on sales_bill.sales_id = s.id
      group by
        s.id,
          s.date,
          bill_no,
          tier,
          users.user_name,
          remarks,
          s.payment ,
          customer_id,
          cdf.company,
          cdf.due_limit ,
          other_payment,
          token,
          COALESCE(past_due,0)
      -- ${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}
      `;


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
      user_id,
      tier,
      remarks,
      sales,
      payment,
      customer_id,
      other_payment,
    } = req.body;
    const insertSalesQuotationQuery = `INSERT INTO sales
    (
       date,
       bill_no,
       user_id,
       tier,
       remarks,
       payment,
       customer_id,
       other_payment,
       token,
       past_due
     )
    VALUES(now(), (select count(bill_no)+1 from sales  where customer_id = ${customer_id}), '${user_id}', '${tier}', '${remarks}', '${payment}', '${customer_id}', '${other_payment}', (select count(token)+1 from sales  where date::date = now()::date), (select cdf_total_due from cdf where id = ${customer_id}) ) returning id;`;
    const { rows } = await pool.query(insertSalesQuotationQuery);
    const salesId = rows[0].id;
    for (let index = 0; index < sales.length; index++) {
      const element = sales[index];
      const insertSalesQuotationDetailsQuery = `INSERT INTO sales_bill
      (
        item_id,
        qty,
        available,
        selling_price,
        total,
        sales_id
        )
        VALUES('${element.item_id}', '${element.qty}', '${element.available}', '${element.selling_price}', '${element.total}',  '${salesId}') ;
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
      bill_no,
      qty,
      amount,
      total_due,
      user_name,
      tier,
      remarks,
      pending_due,
      customer_id,
      amount_pd_total
    } = req.body;
    // if (
    //   !date ||
    //   !bill_no ||
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
    const insertSalesQuotationQuery = `
    INSERT INTO sales (
      date, bill_no, qty, amount, total_due,
      user_name, tier, remarks, pending_due,
      customer_id, amount_pd_total, token
    )
    VALUES
      (
        now(),
        '${bill_no}',
        '${qty}',
        '${amount}',
        '${total_due}',
        '${user_name}',
        '${tier}',
        '${remarks}',
        '${pending_due}',
        '${customer_id}',
        '${amount_pd_total}',
        (
          select
            count(token)+ 1
          from
            sales
          where
            date :: date = now() :: date
        )
      )
    `;
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
    const { id,
        bill_no,
        qty,
        amount,
        total_due,
        remarks,
        pending_due,
        customer_id,
        amount_pd_total,
        sales,
    } = req.body;
    // if (!id  || !bill_no ||  !companyId) {
    //   res
    //     .status(STATUS_CODE.BAD)
    //     .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
    //   return;
    // }
   const updateSalesQuery =   `
      UPDATE
          sales
        SET
          date = now(),
          bill_no = '${bill_no}',
          qty = '${qty}',
          amount = '${amount}',
          total_due = '${total_due}',
          remarks = '${remarks}',
          pending_due = '${pending_due}',
          customer_id = '${customer_id}',
          amount_pd_total = '${amount_pd_total}'
        where
          id = ${id};
       `
       await pool.query(updateSalesQuery);
       const query = `delete from sales_bill where sales_id = ${id};`
       await pool.query(query);
       for (let index = 0; index < sales.length; index++) {
         const element = sales[index];
         const insertSalesBillQuery = `
          INSERT INTO sales_bill
          (
            item_id,
            qty,
            available,
            selling_price,
            total,
            sales_id
          )
            VALUES(${element.item_id}, ${element.qty}, ${element.available}, ${element.selling_price}, ${element.total},  ${id}) ;
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
exports.getSalesById = async (req, res) => {
  try {
    const { salesId } = req.query;
    if (!salesId) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const query =
      ` SELECT
          s.id,
          s.date,
          bill_no,
          qty,
          amount,
          total_due,
          tier,
          grand_total,
          user_name,
          remarks,
          s.payment,
          customer_id,
          cdf.company as customer,
          cdf.due_limit as due_limit,
          pending_due,
          other_payment,
          amount_pd_total
        FROM sales s
        join cdf as cdf
        on cdf.id = s.customer_id
        where s.is_active = true and s.id = ${salesId}`
      const response =  await pool.query( query  );
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.updateValue = async (req, res) => {
  try {
    const { customer_id,  buyingPrice, payment, otherPayment, salesItemDetails
    } = req.body;
    // if (!customer_id ||  !salesItemDetails || !buyingPrice || !payment || !otherPayment) {
    //   res
    //     .status(STATUS_CODE.BAD)
    //     .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
    //   return;
    // }
       let updateCdfBalance = ` update cdf set balance =  COALESCE(balance,0)  + ${buyingPrice} where id = ${customer_id}`;
       await pool.query(updateCdfBalance);
       let updateCdfPayment= ` update cdf set payment =  COALESCE(payment,0) + ${payment} where id = ${customer_id}`;
       await pool.query(updateCdfPayment);
       let updateCdfTotalDue= ` update cdf set  cdf_total_due =  COALESCE(balance,0) - COALESCE(payment,0) where id = ${customer_id}`;
       await pool.query(updateCdfTotalDue);
       let  updateUserBalanceQuery = `update users set balance = balance + ${+payment}  where id = ${res.locals.tokenData.id}`;
       await pool.query(updateUserBalanceQuery);
       let  updateUserOtherBalanceQuery = `update users set balance = balance + ${+otherPayment}  where id = ${res.locals.tokenData.id}`;
       await pool.query(updateUserOtherBalanceQuery);


       for (let index = 0; index < salesItemDetails.length; index++) {
        const element = salesItemDetails[index];


      let updateItems =`
               update
               item
             set
               item_sold = COALESCE(item_sold, 0) + ${element.qty},
               item_available = COALESCE(int_qty, 0) - ${element.qty},
               item_price_total = (COALESCE(int_qty, 0) - ${element.qty}) * silver)
             where
               id = ${element.item_id}
      `
      console.log(updateItems);
      await pool.query(updateItems);
    }
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.isCustomerIdInSales = async (req, res) => {
  try {
      const {customerID} = req.query;
      const  query  =  `select count(id) from sales where customer_id = ${customerID}`
      const response = await pool.query(query)
      res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
}
