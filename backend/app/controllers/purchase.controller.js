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
          or p.date::text ilike '%${search}%'
          or invoice_no::text ilike '%${search}%'
          or qty::text ilike '%${search}%'
          or amount::text ilike '%${search}%'
          or total_due::text ilike '%${search}%'
          or grand_total::text ilike '%${search}%'
          or user_name ilike '%${search}%'
          or remarks ilike '%${search}%'
          or supplier ilike '%${search}%'
          or payment::text ilike '%${search}%'
          or pending_due::text ilike '%${search}%'
          or amount_pd_total::text ilike '%${search}%'
          or other_payment::text ilike '%${search}%'
          or token::text ilike '%${search}%'
        )`;
    }
    searchQuery += ` and p.is_active = ${active}`;
    const query = `  SELECT
      Count(p.id) OVER() AS total,
      p.id,
      no,
      token,
      date,
      supplier,
      amount,
      pending_due,
      amount_pd_total,
      payment,
      total_due,
      other_payment,
      user_name,
      invoice_no,
      qty,
      remarks,
      bill_no
      FROM purchase p
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
    const {
      invoice_no,
      qty,
      amount,
      total_due,
      user_name,
      pending_due,
      remarks,
      sales,
      payment,
      supplier,
      other_payment,
      amount_pd_total
    } = req.body;
    // if (
    //   !date ||
    //   !invoice_no ||
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

    const insertPurchaseQuery = `INSERT INTO purchase
    (
       date,
       invoice_no,
       qty,
       amount,
       total_due,
       pending_due,
       user_name,
       remarks,
       payment,
       supplier,
       other_payment,
       amount_pd_total,
       token,
       bill_no
     )
    VALUES(now(), '${invoice_no}', '${qty}', '${amount}', '${total_due}','${pending_due}', '${user_name}', '${remarks}', '${payment}', '${supplier}', '${other_payment}', '${amount_pd_total}', (select count(token)+1 from purchase  where date::date = now()::date),(select count(bill_no)+1 from purchase where supplier = '${supplier}') ) returning id;`;

    const { rows } = await pool.query(insertPurchaseQuery);
    const salesId = rows[0].id;
    for (let index = 0; index < sales.length; index++) {
      const element = sales[index];
      const insertPurchaseDetailsQuery = `INSERT INTO purchase_details
      (
        item_code,
        qty,
        available,
        selling_price,
        total,
        purchase_id
        )
        VALUES('${element.item_code}', '${element.qty}', '${element.available}', '${element.selling_price}', '${element.total}',  '${salesId}') ;
        `;
      await pool.query(insertPurchaseDetailsQuery);
    }
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
      invoice_no,
      qty,
      amount,
      total_due,
      pending_due,
      user_name,
      remarks,
      payment,
      supplier,
      other_payment,
      amount_pd_total } = req.body;


      const updatePurchaseQuery =  `UPDATE purchase SET date='now()',invoice_no='${invoice_no}', qty='${qty}', amount='${amount}', total_due='${total_due}', pending_due='${pending_due}', user_name='${user_name}', remarks='${remarks}', payment='${payment}', supplier='${supplier}', other_payment='${other_payment}', amount_pd_total='${amount_pd_total}',  where id = ${id};
       `
    await pool.query(updatePurchaseQuery)
        const { updateRows } = await pool.query(updatePurchaseQuery);
        const {updatePurchaseId} = updateRows.length;
       for (let index = 0; index < updatePurchaseId.length; index++) {
         const element = updatePurchaseId[index];
         const updatePurchaseDetailsQuery = `INSERT INTO sales_quotation_details
     (
       qty,
       available,
       selling_price,
       total,
       purchase_id
        )
        VALUES( '${element.qty}', '${element.available}', '${element.selling_price}', '${element.total}',  '${purchaseId}') ;
        `;
        // item_code,'${element.item_code}',
         await pool.query(updatePurchaseDetailsQuery);
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
      `UPDATE purchase SET is_active = ${status} where "id" = '${id}'`
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
