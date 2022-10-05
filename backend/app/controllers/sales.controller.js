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
      userId,
      selectedCustomerId
    } = req.query;
    let searchQuery = 'HAVING  true';
    if (fromDate && toDate) {
      searchQuery += ` and s.date::date between  '${fromDate}'::date and '${toDate}'::date `;
    }
    if (userId) {
      searchQuery += ` and s.user_id = ${+userId} `;
    }
    if (selectedCustomerId) {
      searchQuery += ` and s.customer_id = ${+selectedCustomerId} `;
    }
    const offset = pageSize * pageNumber - pageSize;
    if (search) {
      searchQuery += ` and
        (
          id::text like '%${search}%'
          or s.date::text like '%${search}%'
          or bill_no::text like '%${search}%'
          or users.user_name like '%${search}%'
          or tier like '%${search}%'
          or remarks like '%${search}%'
          or cdf.company like '%${search}%'
          or payment::text like '%${search}%'
          or COALESCE(past_due,0)::text like '%${search}%'
          or other_payment::text like '%${search}%'
          or token::text like '%${search}%'
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
        is_editable,
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
          is_editable,
          COALESCE(past_due,0),
          s.is_active,
          s.user_id
     ${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}
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
    const loggedInUserId = res.locals.tokenData.id;
    const {
      user_id,
      tier,
      remarks,
      sales,
      payment,
      customer_id,
      other_payment
    } = req.body;
    const query = `update sales set  is_editable = false where customer_id =  ${customer_id} and user_id=${user_id} `
    await pool.query(query);
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
       is_editable
     )
    VALUES(now(), (select count(bill_no)+1 from sales  where customer_id = ${customer_id}), '${user_id}', '${tier}', '${remarks}', '${payment}', '${customer_id}', '${other_payment}', (select count(token)+1 from sales  where date::date = now()::date), true ) returning id;`;
    const { rows } = await pool.query(insertSalesQuotationQuery);
    const salesId = rows[0].id;
    await this.updateValue(
      customer_id,
      payment,
      other_payment,
      sales,
      salesId,
      loggedInUserId,
      false
    );
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
    const loggedInUserId = res.locals.tokenData.id;
    const {
      id,
      bill_no,
      remarks,
      past_due,
      customer_id,
      payment,
      other_payment,
      sales
    } = req.body;
    const updateSalesQuery = `
      UPDATE
          sales
        SET
          date = now(),
          bill_no = '${bill_no}',
          remarks = '${remarks}',
          past_due = '${past_due}',
          customer_id = '${customer_id}'
        where
          id = ${id};
       `;
    await pool.query(updateSalesQuery);
    await this.updateValue(
      customer_id,
      payment,
      other_payment,
      sales,
      id,
      loggedInUserId,
      true
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.changeStatus = async (req, res) => {
  try {
    let itemsCost = 0;
    const { id, status } = req.body;
    if (!id) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const activeStatusQuery = `UPDATE sales SET is_active = ${status} where "id" = '${id}'`
    await pool.query(activeStatusQuery);
    const getSalesQuery = `select customer_id, user_id, payment, other_payment from sales where id =  ${id}`
    const salesResponse = await pool.query(getSalesQuery);
    const getSalesBillQuery = `select selling_price, qty, item_id from sales_bill where sales_id = ${id}`
    const existingItemResponse = await pool.query(getSalesBillQuery);
    const existingItems = existingItemResponse.rows;
    if( status ===  false) {
      const usersBalance = `update users set balance = balance - ${salesResponse.rows[0].payment} - ${salesResponse.rows[0].other_payment} where id = ${salesResponse.rows[0].user_id}`
      console.log(usersBalance);
      await pool.query(usersBalance);
      for (let index = 0; index < existingItems.length; index++) {
        const element = existingItems[index];
        console.log(element);
        const updateSalesBillQuery = `update item set
         item_sold =  item_sold - ${element.qty}
        where id =  ${element.item_id}`
        console.log(updateSalesBillQuery);
        await pool.query(updateSalesBillQuery);
        itemsCost = +element.selling_price * +element.qty + itemsCost;
       }
       const customerQuery = `
          update cdf set
           balance = balance - ${itemsCost},
           payment = payment - COALESCE(${salesResponse.rows[0].payment},0)
          where
           id = ${salesResponse.rows[0].customer_id}`
        await pool.query(customerQuery);
        const salesEditQuery1 = `update sales set
           is_editable = false   where
          id= ${id}`
          console.log(salesEditQuery1);
          await pool.query(salesEditQuery1)
          const query2 = `
          select
            id
          from
          sales where
           customer_id = ${salesResponse.rows[0].customer_id} and
           user_id = ${salesResponse.rows[0].user_id} and
           is_active = true
          order by id desc limit 1 `
          const response = await pool.query(query2);
          const findSalesEditableId = response.rowCount > 0 ? response.rows[0].id: null;
      if(findSalesEditableId){
        const salesEditQuery2 = `update sales set
           is_editable = true   where
          id = ${findSalesEditableId}`
          console.log(salesEditQuery2);
          await pool.query(salesEditQuery2)
      }
    }
    if( status ===  true) {
      const usersBalance = `update users set balance = balance + ${salesResponse.rows[0].payment} + ${salesResponse.rows[0].other_payment} where id = ${salesResponse.rows[0].user_id}`
      console.log(usersBalance);
      await pool.query(usersBalance);
      for (let index = 0; index < existingItems.length; index++) {
        let element = existingItems[index];
        const updateSalesBillQuery = `update item set
          item_sold =  item_sold + ${+element.qty}
          where id =  ${element.item_id}`
          console.log(updateSalesBillQuery);
        await pool.query(updateSalesBillQuery);
        itemsCost = +element.selling_price * +element.qty + itemsCost;
       }
       const customerQuery = `
          update cdf set
               balance = balance + ${itemsCost},
               payment = payment + ${salesResponse.rows[0].payment}
           where
               id = ${salesResponse.rows[0].customer_id}`
          console.log(customerQuery);
        await pool.query(customerQuery);
        const salesEditQuery1 = `update sales set
           is_editable = false   where
          id= ${id}`
          console.log(salesEditQuery1);
          await pool.query(salesEditQuery1);
          const query2 = `
          select
            id
          from
          sales where
           customer_id = ${salesResponse.rows[0].customer_id} and
           user_id = ${salesResponse.rows[0].user_id} and
           is_active = true
          order by id desc limit 1 `
          const response = await pool.query(query2);
          const findSalesEditableId = response.rowCount > 0 ? response.rows[0].id: null;
          if(findSalesEditableId){
            const salesEditQuery2 = `update sales set
               is_editable = true   where
              id = ${findSalesEditableId}`
              console.log(salesEditQuery2);
              await pool.query(salesEditQuery2)
          }
    }
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
    const query = ` SELECT
          s.id,
          s.date,
          bill_no,
          tier,
          user_id,
          remarks,
          s.payment,
          customer_id,
          cdf.company as customer,
          cdf.due_limit as due_limit,
          other_payment,
          token,
          users.user_name as user_name,
          s.past_due as past_due
        FROM sales s
         join cdf as cdf
           on cdf.id = s.customer_id
         join users as users
           on users.id = s.user_id
            where s.is_active = true and s.id = ${salesId}`;
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.updateValue = async (
  customerId,
  payment,
  otherPayment,
  salesItemDetails,
  salesId,
  loggedInUserId,
  isSalesUpdate
) => {
  try {
    let itemsCost = 0;
    let existingItemsCost = 0;
    const query1 = `select qty, selling_price, item_id from sales_bill where sales_id = ${salesId}`;
    const existingItemResponse = await pool.query(query1);
    const existingItems = existingItemResponse.rows;
    for (let index = 0; index < existingItems.length; index++) {
      const item = existingItems[index];
      const query2 = `update item set item_sold = item_sold - ${item.qty}
      where id = ${item.item_id}`;
      await pool.query(query2);
      existingItemsCost = item.qty * item.selling_price + existingItemsCost;
    }
    const query3 = `delete from sales_bill where sales_id = ${salesId};`;
    await pool.query(query3);
    for (let index = 0; index < salesItemDetails.length; index++) {
      const element = salesItemDetails[index];
      const query4 = `INSERT INTO sales_bill
      (
        item_id,
        qty,
        selling_price,
        sales_id,
        weight
        )
        VALUES(${element.item_id}, ${element.qty},  ${element.selling_price},   ${salesId}, ${element.weight}) ;
        `;
      await pool.query(query4);
      let query5 = `
        update
          item
        set
          item_sold = COALESCE(item_sold, 0) + ${element.qty}
        where
      id = ${element.item_id}
`;
      await pool.query(query5);
      itemsCost = +element.selling_price * +element.qty + itemsCost;
    }
    let existingPayment = 0;
    let existingOtherPayment = 0;
    if (isSalesUpdate === true) {
      let query7 = `select payment, other_payment from sales where id = ${salesId}`;
      const existingBillResponse = await pool.query(query7);
      const existingBill =
        existingBillResponse.rows && existingBillResponse.rows.length > 0
          ? existingBillResponse.rows[0]
          : null;
      if (existingBill) {
        existingPayment = existingBill.payment;
        existingOtherPayment = existingBill.other_payment;
        let query = `update  sales set
            payment = COALESCE(payment,0) - ${existingPayment} + ${payment},
            other_payment = COALESCE(other_payment,0) - ${existingOtherPayment} - ${otherPayment}
          where id = ${salesId}`;
        await pool.query(query);
      }
    } else {
      let query10 = `update sales set past_due = (select cdf_total_due from cdf where id = ${customerId} ) where id = ${salesId}`;
      await pool.query(query10);
    }
    let query6 = ` update cdf set
        balance =  COALESCE(balance,0) + ${existingItemsCost}  + ${itemsCost},
        payment = COALESCE(payment,0) - ${existingPayment} + ${payment},
        cdf_total_due = (COALESCE(balance,0) - ${existingItemsCost}  + ${itemsCost}) - (COALESCE(payment,0) - ${existingPayment} + ${payment})
      where id = ${customerId} returning cdf_total_due`;
    await pool.query(query6);

    let query11 = ` select id, date from rojmed where date::date = now()::date and user_id = ${loggedInUserId}`
    const response = await pool.query(query11);
    console.log(response.rows);
    if(response.rows.length === 0 ){
    let query12 = `select balance from users where id = ${loggedInUserId}`
     const userResponse = await pool.query(query12);
    const loggedInUserBalance = userResponse.rows[0].balance;

     let query13 = ` INSERT INTO rojmed (
      date, balance, sale, user_id)  VALUES (now(), ${loggedInUserBalance}, ${payment}, ${loggedInUserId})`
      console.log(query13);
    await pool.query(query13);
    } else {
      const query14 = `update rojmed set sale = COALESCE(sale,0) + ${payment} where user_id = ${loggedInUserId}`
      await pool.query(query14)
    }


    let query8 = `update users set balance = balance - ${existingPayment} - ${existingOtherPayment} + ${+payment}  + ${
      +otherPayment ? otherPayment : 0
    }  where id = ${loggedInUserId}`;
    await pool.query(query8);


  } catch (error) {
    throw new Error(error.message || MESSAGES.COMMON.ERROR);
  }
};
exports.isCustomerIdInSales = async (req, res) => {
  try {
    const { customerID } = req.query;
    const query = `select count(id) from sales where customer_id = ${customerID}`;
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.salesPrint = async (req, res) => {
  try {
    const { salesId } = req.query;
    const query = `   SELECT
    categories.name as category_name,
     categories.id as categories_id,
        s.id,
        row_number() OVER (PARTITION BY categories.id order by categories.id desc) as row_number_by_category_id,
        s.date,
        bill_no,
        tier,
        user_id,
        remarks,
        s.payment,
        customer_id,
        cdf.company as customer,
        cdf.due_limit as due_limit,
        other_payment,
        token,
        users.user_name as user_name,
        s.past_due as past_due,
        sales_bill.item_id as sales_item_id,
        sales_bill.qty as sales_bill_qty,
        sales_bill.weight as sales_weight,
        sales_bill.selling_price as sales_bill_selling_price,
        item.item_code as item_item_code
      FROM sales s
      join cdf as cdf
       on cdf.id = s.customer_id
      join users as users
       on users.id = s.user_id
      join sales_bill
       on sales_bill.sales_id = s.id
      join item
       on sales_bill.item_id = item.id
      join categories
       on categories.id = item.category_id
      where s.is_active = true and s.id = ${salesId}
       order by categories.name asc `;
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.dateWiseSalesSearch = async (req, res) =>{
  try {
    const {
      startDate,
      endDate
    } = req.query;
    const query = `
      SELECT
        s.id,
        tier,
        payment,
        customer_id,
        user_id, s.date,
        sales_bill.qty as sales_bill_qty,
        sales_bill.selling_price as sales_bill_selling_price,
        sales_bill.qty * sales_bill.selling_price as amount
    FROM public.sales s
     join sales_bill as sales_bill
      on sales_bill.sales_id = s.id
       group by
        s.id,
        tier,
        payment,
        customer_id,
        user_id,
        s.date,
        sales_bill.qty,
        sales_bill.selling_price
     having s.date::date between ${startDate}::date and ${endDate}::date
    `
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
}
exports. getSalesByUserIdInRojMed = async (req, res) =>{
  try {
    const {
     userId
    } = req.query;
    const query = `
    SELECT
      s.id,
      s.date,
      s.bill_no,
      s.payment,
      other_payment,
      sales_bill.qty as sales_qty,
      sales_bill.selling_price as sales_price,
      cdf.company as customer,
      cdf.id as customer_id,
      users.user_name as user_name
    from sales  s
    left join  sales_bill as sales_bill
      on sales_bill.sales_id = s.id
    join cdf as  cdf
      on cdf.id = s.customer_id
    join users as users
      on users.id = s.user_id
        where user_id = ${userId} and s.is_active = true  and s.date::date = now()::date`
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
}
