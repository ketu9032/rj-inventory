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
      selectSupplierId,
      userId
    } = req.query;
    let searchQuery = 'having true';
    if (fromDate && toDate) {
      searchQuery += ` and p.date::date between  '${fromDate}'::date and '${toDate}'::date `;
    }
    if (userId) {
      searchQuery += ` and p.user_id = ${+userId} `;
    }
    if (selectSupplierId) {
      searchQuery += ` and suppliers_id = ${+selectSupplierId} `;
    }
    const offset = pageSize * pageNumber - pageSize;
    if (search) {
      searchQuery += ` and
        (
          p.id::text ilike '%${search}%'
          or p.date::text ilike '%${search}%'
          or bill_no::text ilike '%${search}%'
          or users.user_name ilike '%${search}%'
          or remarks ilike '%${search}%'
          or payment::text ilike '%${search}%'
          or COALESCE(past_due,0)::text ilike '%${search}%'
          or other_payment::text ilike '%${search}%'
          or token::text ilike '%${search}%'
        )`;
    }
    searchQuery += ` and p.is_active = ${active}`;
    const query = `  SELECT
    Count(p.id) OVER() AS total,
      p.id,
      p.no,
      token,
      p.date,
      suppliers_id,
      suppliers.company as suppliers_company,
      amount,
      payment,
      other_payment,
      p.qty,
      remarks,
      bill_no,
      past_due,
      sum(COALESCE(purchase_details.qty,0) * COALESCE(purchase_details.selling_price,0)) + COALESCE(past_due,0) as total_amount,
      sum(COALESCE(purchase_details.qty,0) * COALESCE(purchase_details.selling_price,0)) as amount,
      sum((COALESCE(purchase_details.qty,0) * COALESCE(purchase_details.selling_price,0)) + COALESCE(past_due,0)) - payment as total_due,
      users.id as user_id,
      users.user_name as user_name
    FROM purchase p
    join users as users
      on users.id = p.user_id
    join suppliers as suppliers
      on suppliers.id = p.suppliers_id
    left join purchase_details
      on purchase_details.purchase_id = p.id
    group by
      p.id,
      p.no,
      token,
      p.date,
      suppliers_id,
      suppliers.company,
      amount,
      payment,
      other_payment,
      p.qty,
      remarks,
      bill_no,
      past_due,
      users.user_name,
      users.id,
      p.user_id,
      p.is_active
    ${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}
      `;
    const response = await pool.query(query);
    // sum(COALESCE(purchase_details.qty,0) * COALESCE(purchase_details.selling_price,0)) + COALESCE(past_due,0) as total_amount,
    // sum(COALESCE(purchase_details.qty,0) * COALESCE(purchase_details.selling_price,0)) as amount,
    // sum(COALESCE(purchase_details.qty,0) * COALESCE(purchase_details.selling_price,0)) + COALESCE(past_due,0) - p.payment as total_due
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
      `UPDATE purchase SET is_deleted = true  where "id" = '${id}'`
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
      past_due,
      remarks,
      sales,
      payment,
      suppliers_id,
      other_payment
    } = req.body;
    const insertPurchaseQuery = `
    INSERT INTO purchase (
      date,  past_due, user_id,
      remarks, payment, suppliers_id, other_payment,
      token,
      bill_no
    )
    VALUES
      (
        now(),
       ' ${past_due}',
        '${user_id}',
        '${remarks}',
       ' ${payment}',
       ' ${suppliers_id}',
       ' ${other_payment}',
       (select count(token)+1 from purchase  where date::date = now()::date),
       (select count(bill_no)+1 from purchase where suppliers_id = '${suppliers_id}')
      ) returning id
    ;`;
    const { rows } = await pool.query(insertPurchaseQuery);
    const purchaseId = rows[0].id;
    await this.updateValue(
      suppliers_id,
      payment,
      other_payment,
      sales,
      purchaseId,
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
exports.update = async (req, res) => {
  try {
    const loggedInUserId = res.locals.tokenData.id;
    const {
      id,
      remarks,
      past_due,
      suppliers_id,
      payment,
      other_payment,
      sales
    } = req.body;
    const getOldPaymentQuery = `select payment from purchase where id = ${id}`;
    const paymentResponse = await pool.query(getOldPaymentQuery);
    const getOldPurchasePriceQuery = `SELECT qty*selling_price  AS total_price FROM purchase_details where purchase_id = ${id}`;
    const responsePurchasePrice = await pool.query(getOldPurchasePriceQuery);
    const updatePurchaseQuery = `UPDATE
      purchase
    SET
      date = now(),
      past_due = ${past_due},
      remarks = '${remarks}',
      payment = ${payment},
      suppliers_id = ${suppliers_id},
      other_payment = ${other_payment}
    where
      id = ${id}`;
    await pool.query(updatePurchaseQuery);
    await this.updateValue(
      suppliers_id,
      payment,
      other_payment,
      sales,
      id,
      loggedInUserId,
      true,
      paymentResponse,
      responsePurchasePrice
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
    const { id, status } = req.body;
    if (!id) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE purchase SET is_active = ${status} where "id" = '${id}'`
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.getPurchaseById = async (req, res) => {
  try {
    const { purchaseId } = req.query;
    if (!purchaseId) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const query = ` SELECT
          p.id,
          p.date,
          bill_no,
          user_id,
          remarks,
          p.payment,
          suppliers.company as supplier_customer,
          suppliers.due_limit as supplier_due_limit,
          other_payment,
          p.past_due as past_due
        FROM purchase p
        join suppliers as suppliers
        on suppliers.id = p.suppliers_id
        where p.is_active = true and p.id = ${purchaseId}`;
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.isSupplierIdInPurchase = async (req, res) => {
  try {
    const { supplierID } = req.query;
    const query = `select count(id) from purchase where suppliers_id = ${supplierID}`;
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.updateValue = async (
  supplierId,
  payment,
  otherPayment,
  purchaseItemDetails,
  purchaseId,
  loggedInUserId,
  isPurchaseUpdate,
  paymentResponse,
  responsePurchasePrice
) => {
  try {
    let query11 = ` select id, date from rojmed where date::date = now()::date and user_id = ${loggedInUserId}`;
    const response = await pool.query(query11);
    if (response.rows.length === 0) {
      let query12 = `select balance from users where id = ${loggedInUserId}`;
      const userResponse = await pool.query(query12);
      const loggedInUserBalance = userResponse.rows[0].balance;

      let query13 = ` INSERT INTO rojmed (
      date, balance, purchase, user_id)  VALUES (now(), ${loggedInUserBalance}, ${payment}, ${loggedInUserId})`;
      await pool.query(query13);
    } else {
      const query14 = `update rojmed set purchase = COALESCE(purchase,0) + ${payment} where user_id = ${loggedInUserId}`;
      await pool.query(query14);
    }

    let itemsCost = 0;
    let existingItemsCost = 0;
    const query1 = `select qty, selling_price, item_id from purchase_details where purchase_id = ${purchaseId}`;
    const existingItemResponse = await pool.query(query1);
    const existingItems = existingItemResponse.rows;
    for (let index = 0; index < existingItems.length; index++) {
      const item = existingItems[index];
      const query2 = `update item set item_purchased = item_purchased - ${item.qty}
      where id = ${item.item_id}`;
      await pool.query(query2);
      existingItemsCost = item.qty * item.selling_price + existingItemsCost;
    }
    const query3 = `delete from purchase_details where purchase_id = ${purchaseId};`;
    await pool.query(query3);
    for (let index = 0; index < purchaseItemDetails.length; index++) {
      const element = purchaseItemDetails[index];
      const query4 = `INSERT INTO purchase_details
      (
        item_id,
        qty,
        selling_price,
        purchase_id,
        weight,
        date
        )
        VALUES(${element.item_id}, ${element.qty},  ${element.selling_price},   ${purchaseId}, ${element.weight}, now()) ;
        `;
      await pool.query(query4);
      let query5 = `
        update
          item
        set
        item_purchased = COALESCE(item_purchased, 0) + ${element.qty}
        where
      id = ${element.item_id}
`;
      await pool.query(query5);
      itemsCost = +element.selling_price * +element.qty + itemsCost;
    }
    let existingPayment = 0;
    let existingOtherPayment = 0;
    if (isPurchaseUpdate === true) {
      let query7 = `select payment, other_payment from purchase where id = ${purchaseId}`;
      const existingBillResponse = await pool.query(query7);
      const existingBill =
        existingBillResponse.rows && existingBillResponse.rows.length > 0
          ? existingBillResponse.rows[0]
          : null;
      if (existingBill) {
        existingPayment = existingBill.payment;
        existingOtherPayment = existingBill.other_payment;
        let query = `update  purchase set
            payment = COALESCE(payment,0) - ${existingPayment} + ${payment},
            other_payment = COALESCE(other_payment,0) - ${existingOtherPayment} - ${otherPayment}
          where id = ${purchaseId}`;
        await pool.query(query);
        let query8 = `update users set balance = balance + ${paymentResponse.rows[0].payment} - ${payment}  where id = ${loggedInUserId} `;
        await pool.query(query8);
        let query6 = ` update suppliers set
          purchase_price = purchase_price - ${responsePurchasePrice.rows[0].total_price}  + ${itemsCost},
          purchase_payment = purchase_payment - ${paymentResponse.rows[0].payment} +  ${payment},
          suppliers_total_due = (purchase_price - ${responsePurchasePrice.rows[0].total_price}  + ${itemsCost}) - (purchase_payment - ${paymentResponse.rows[0].payment} + ${payment}) where id = ${supplierId} `;
        await pool.query(query6);
      }
    } else {
      let query10 = `update purchase set past_due = (select suppliers_total_due from suppliers where id = ${supplierId} ) where id = ${purchaseId}`;
      await pool.query(query10);
      let query8 = `update users set balance = balance  - ${payment}  where id = ${loggedInUserId} `;
      await pool.query(query8);
      let query6 = ` update suppliers set
      purchase_price =  COALESCE(purchase_price,0) - ${existingItemsCost}  + ${itemsCost},
      purchase_payment = COALESCE(purchase_payment,0) - ${existingPayment} + ${payment},
      suppliers_total_due = suppliers_total_due +  (COALESCE(purchase_price,0) - ${existingItemsCost}  + ${itemsCost}) - (COALESCE(purchase_payment,0) - ${existingPayment} + ${payment})
        where id = ${supplierId} returning suppliers_total_due`;
      await pool.query(query6);
    }
  } catch (error) {
    throw new Error(error.message || MESSAGES.COMMON.ERROR);
  }
};
exports.purchasePrint = async (req, res) => {
  try {
    const { purchaseId } = req.query;
    const query = `  SELECT
    categories.name as category_name,
     categories.id as categories_id,
        p.id,
        row_number() OVER (PARTITION BY categories.id order by categories.id desc) as row_number_by_category_id,
        p.date,
        bill_no,
        user_id,
        remarks,
        p.payment,
        suppliers_id,
        suppliers.company as suppliers_company,
        other_payment,
        token,
		    user_id,
        users.user_name as user_name,
        p.past_due as past_due,
        purchase_details.item_id as purchase_item_id,
        purchase_details.qty as purchase_details_qty,
        purchase_details.weight as purchase_details_weight,
        purchase_details.selling_price as purchase_details_selling_price,
        item.item_code as item_item_code
       FROM purchase p
     join suppliers as suppliers
      on suppliers.id = P.suppliers_id
     join users as users
      on users.id = p.user_id
     join purchase_details
       on purchase_details.purchase_id = p.id
     join item
       on purchase_details.item_id = item.id
     join categories
       on categories.id = item.category_id
       where p.is_active = true and p.id = ${purchaseId}
       order by categories.name asc ; `;
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.getPurchaseByUserIdInRojMed = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = `
    SELECT
      p.id,
      p.date,
      p.bill_no,
      p.payment,
      other_payment,
      purchase_details.qty as purchase_qty,
      purchase_details.selling_price as purchase_price,
      suppliers.company as supplier_company
    from purchase  p
     join  purchase_details as purchase_details
      on purchase_details.purchase_id = p.id
        join  suppliers as suppliers
      on suppliers.id = p.suppliers_id
        where user_id = ${userId} and p.is_active = true  and p.date::date = now()::date`;
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
