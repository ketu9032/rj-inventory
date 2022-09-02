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
          or bill_no::text ilike '%${search}%'
          or qty::text ilike '%${search}%'
          or amount::text ilike '%${search}%'
          or total_due::text ilike '%${search}%'
          or grand_total::text ilike '%${search}%'
          or user_name ilike '%${search}%'
          or tier ilike '%${search}%'
          or remarks ilike '%${search}%'
          or cdf.company ilike '%${search}%'
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
        bill_no,
        qty,
        amount,
        s.total_due as "salesTotalDue",
        tier,
        grand_total,
        user_name,
        remarks,
        s.payment,
        customer_id,
        cdf.company as customer,
        cdf.due_limit as cdf_due_limit,
        pending_due,
        other_payment,
        amount_pd_total,
        token
      FROM sales s
      join cdf as cdf
      on cdf.id = s.customer_id
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
      customer_id,
      other_payment,
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
    const insertSalesQuotationQuery = `INSERT INTO sales
    (
       date,
       bill_no,
       qty,
       amount,
       total_due,
       pending_due,
       user_name,
       grand_total,
       tier,
       remarks,
       payment,
       customer_id,
       other_payment,
       amount_pd_total,
       token
     )
    VALUES(now(), (select count(bill_no)+1 from sales  where customer_id = ${customer_id}), '${qty}', '${amount}', '${total_due}','${pending_due}', '${user_name}', '${grand_total}', '${tier}', '${remarks}', '${payment}', '${customer_id}', '${other_payment}', '${amount_pd_total}', (select count(token)+1 from sales  where date::date = now()::date) ) returning id;`;
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
          no,
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
    if (!customer_id ||  !salesItemDetails || !buyingPrice || !payment || !otherPayment) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
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

      let updateItemQty =`  update item set int_qty = int_qty - ${element.qty} where id = ${element.item_id}`
      await pool.query(updateItemQty);
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
