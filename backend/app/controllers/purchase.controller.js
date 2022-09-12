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
          p.id::text ilike '%${search}%'
          or p.date::text ilike '%${search}%'
          or bill_no::text ilike '%${search}%'
          or users.user_name ilike '%${search}%'
          or tier ilike '%${search}%'
          or remarks ilike '%${search}%'
          or payment::text ilike '%${search}%'
          or COALESCE(past_due,0)::text ilike '%${search}%'
          or other_payment::text ilike '%${search}%'
          or token::text ilike '%${search}%'
        )`;
    }
    searchQuery += ` and s.is_active = ${active}`;
   const query = `  SELECT
    Count(p.id) OVER() AS total,
      p.id,
      p.no,
      token,
      date,
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
      date,
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
      users.id
      -- ${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}
      `
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
      other_payment,
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
    console.log(insertPurchaseQuery);

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
      const updatePurchaseQuery =  `UPDATE
      purchase
    SET
      date = now(),
      past_due = ${past_due},
      remarks = '${remarks}',
      payment = ${payment},
      suppliers_id = ${suppliers_id},
      other_payment = ${other_payment}
    where
      id = ${id}`
    await pool.query(updatePurchaseQuery);
        await this.updateValue(
          suppliers_id,
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
  isPurchaseUpdate
) => {
  try {
    let itemsCost = 0;
    let existingItemsCost = 0;
    const query1 = `select qty, selling_price, item_id from purchase_details where purchase_id = ${purchaseId}`;
    const existingItemResponse = await pool.query(query1);
    const existingItems = existingItemResponse.rows;
    for (let index = 0; index < existingItems.length; index++) {
      const item = existingItems[index];
      const query2 = `update item set item_sold = item_sold - ${item.qty}
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
        purchase_id
        )
        VALUES(${element.item_id}, ${element.qty},  ${element.selling_price},   ${purchaseId}) ;
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
      }
    }

      let query10 = `update purchase set past_due = (select suppliers_total_due from suppliers where id = ${supplierId} ) where id = ${purchaseId}`;
      console.log(query10);
      await pool.query(query10);

    let query6 = ` update suppliers set
    purchase_price =  COALESCE(purchase_price,0) - ${existingItemsCost}  + ${itemsCost},
    purchase_payment = COALESCE(purchase_payment,0) - ${existingPayment} + ${payment},
    suppliers_total_due = suppliers_total_due + (COALESCE(purchase_price,0) - ${existingItemsCost}  + ${itemsCost}) - (COALESCE(purchase_payment,0) - ${existingPayment} + ${payment})
      where id = ${supplierId} returning suppliers_total_due`;
    await pool.query(query6);

    let query8 = `update users set balance = balance - ${existingPayment} - ${existingOtherPayment} + ${+payment}  + ${
      +otherPayment ? otherPayment : 0
    }  where id = ${loggedInUserId}`;
    await pool.query(query8);
  } catch (error) {
    throw new Error(error.message || MESSAGES.COMMON.ERROR);
  }
};
