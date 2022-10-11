const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');

exports.findAll = async (req, res) => {
  try {
    const { orderBy, direction, pageSize, pageNumber, search, active } =
      req.query;
    let searchQuery = 'having true';
    const offset = pageSize * pageNumber - pageSize;
    if (search) {
      searchQuery += ` and
        (
           item_code like '%${search}%'
          or item_name like '%${search}%'
          or qty_30_days::text like '%${search}%'
          or qty_15_days::text like '%${search}%'
          or qty_07_days::text like '%${search}%'
        )`;
    }
    searchQuery += ` and is_active = ${active}`;

    const query = `
                  select
            sbi.item_id,
            sbi.item_name,
            sbi.item_code,
            int_qty,

            (select
              sum(qty)
            from sales_bill as sb
            where date between (now()  - interval '30 day')::date And  now()::date and sb.item_id = sbi.item_id) as qty_30_days,
            (select
              sum(qty)
            from sales_bill as sb
            where date between (now()  - interval '15 day')::date And  now()::date and sb.item_id = sbi.item_id) as qty_15_days,
            (select
              sum(qty)
            from sales_bill as sb
            where date between (now()  - interval '7 day')::date And  now()::date and sb.item_id = sbi.item_id) as qty_7_days
          from (
            select item_id, item_name,item_code, int_qty
              from sales_bill
            left join  item as item
              on  item.id = sales_bill.item_id
              group by sales_bill.item_id, item.item_name, item.item_code, item.int_qty, item.id
          ) as sbi
          `;
    // ${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}
    console.log(query);
    const response = await pool.query(query);

    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
