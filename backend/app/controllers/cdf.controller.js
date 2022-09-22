const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
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
      cdfStatus,
      fromDate,
      toDate
    } = req.query;
    let searchQuery = 'where true';
    if (fromDate && toDate) {
      searchQuery += ` and date::date between  '${fromDate}'::date and '${toDate}'::date `;
    }
    //and is_deleted = false
    const offset = pageSize * pageNumber - pageSize;
    if (search) {
      searchQuery += ` and
        (email like '%${search}%'
          or name like '%${search}%'
          or company like '%${search}%'
          or int_balance like '%${search}%'
          or date::text like '%${search}%'
          or reference like '%${search}%'
          or reference_person like '%${search}%'
          or brands like '%${search}%'
          or display_names like '%${search}%'
          or platforms like '%${search}%'
          or other like '%${search}%'
          or mobile::text like '%${search}%'
          or address like '%${search}%'
          or due_limit::text like '%${search}%'
          or payment::text like '%${search}%'
          or cdf_total_due::text like '%${search}%'
          or balance::text like '%${search}%'
          or tier_code like '%${search}%'
        )`;
    }
    searchQuery += ` and c.is_active = ${active}  `;
    if (cdfStatus) {
      searchQuery += ` and lower(c.cdf_status) = '${cdfStatus.toLowerCase()}'`;
    }
    const query = `
    SELECT
      Count(c.id) OVER() AS total,
      c.id,
          c.name,
          email,
          company,
          date,
          reference,
          reference_person,
          brands,
          int_balance,
          display_names,
          platforms,
          other,
          mobile,
          address,
          due_limit,
          cdf_total_due,
          payment,
          balance,
          tier_id as tier_id,
          t.code as tier_code
    FROM
        cdf c
         full Join tiers t
        on t.id = c.tier_id
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
    await pool.query(`UPDATE cdf
        SET is_deleted = true where "id" = '${id}'`);
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
      email,
      name,
      company,
      date,
      reference,
      referencePerson,
      brands,
      displayNames,
      platforms,
      other,
      mobile,
      address
    } = req.body;
    if (
      !email ||
      !name ||
      !company ||
      !date ||
      !reference ||
      !referencePerson ||
      !brands ||
      !displayNames ||
      !platforms ||
      !other ||
      !mobile ||
      !address
    ) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `INSERT INTO cdf
      ( email,
        name,
        company,
        date,
        reference ,
        reference_person ,
        brands ,
        display_names ,
        platforms ,
        other ,
        mobile ,
        address)
      VALUES('${email}', '${name}', '${company}', '${date}', '${reference}', '${referencePerson}', '${brands}', '${displayNames}', '${platforms}', '${other}', '${mobile}', '${address}');
      `
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
    const {
      id,
      email,
      name,
      company,
      date,
      reference,
      referencePerson,
      brands,
      displayNames,
      platforms,
      other,
      mobile,
      address
    } = req.body;
    if (
      !email ||
      !name ||
      !company ||
      !date ||
      !reference ||
      !referencePerson ||
      !brands ||
      !displayNames ||
      !platforms ||
      !other ||
      !mobile ||
      !address ||
      !id
    ) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(
      `UPDATE cdf
      SET email='${email}', name='${name}', company='${company}', date='${date}', reference='${reference}', reference_person='${referencePerson}', brands='${brands}', display_names='${displayNames}', platforms='${platforms}', other='${other}', mobile='${mobile}', address='${address}' where id = ${id};
       `
    );
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
// exports.getCdfDropDown = async(req, res) => {
//     try {
//         const response = await pool.query(`select id, company FROM cdf where is_deleted = false and is_active = true`);
//         res.status(STATUS_CODE.SUCCESS).send(response.rows);
//     } catch (error) {
//         res.status(STATUS_CODE.ERROR).send({
//             message: error.message || MESSAGES.COMMON.ERROR
//         });
//     }
// };
exports.changeStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(`UPDATE cdf
      SET is_active = ${status} where "id" = '${id}'`);
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.changeCdfStatus = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    await pool.query(`update cdf
        set cdf_status  = 'active' WHERE "id" = '${id}'`);
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.cdfTOCustomersUpdate = async (req, res) => {
  try {
    const {
      id,
      name,
      address,
      dueLimit,
      balance,
      tierId
    } = req.body;
    // if (
    //   !company ||
    //   !name ||
    //   !address ||
    //   !email ||
    //   !cdf_total_due ||
    //   !mobile ||
    //   !dueLimit ||
    //   !balance ||
    //   !other ||
    //   !tierId ||
    //   !tier_code ||
    //   !id
    // ) {
    //   res
    //     .status(STATUS_CODE.BAD)
    //     .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
    //   return;
    // }

    const query =  `UPDATE cdf
    SET   name='${name}',  address='${address}', due_limit=${dueLimit},int_balance=${balance}, cdf_total_due=${balance}, cdf_status='active',  tier_id='${tierId}' where id = ${id}
     `;

     console.log(query);
    await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.onCheckEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await pool.query(
      `select id from cdf where  lower(email) = trim(lower('${email}'))`
    );
    if (response.rowCount > 0) {
      return res.status(STATUS_CODE.SUCCESS).send(false);
    }
    return res.status(STATUS_CODE.SUCCESS).send(true);
  } catch (error) {
    return res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.onCheckCompany = async (req, res) => {
  try {
    const { company } = req.body;
    const response =
      await pool.query(`select id from cdf where lower(company) = trim(lower('${company}'))
       `);
    if (response.rowCount > 0) {
      return res.status(200).send(false);
    }
    return res.status(STATUS_CODE.SUCCESS).send(true);
  } catch (error) {
    return res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.onCheckMobile = async (req, res) => {
  try {
    const { mobile } = req.body;
    const response =
      await pool.query(`select id from cdf where mobile = ${mobile}
       `);
    if (response.rowCount > 0) {
      return res.status(200).send(false);
    }
    return res.status(STATUS_CODE.SUCCESS).send(true);
  } catch (error) {
    return res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.getCdfTOCustomerDropDown = async (req, res) => {
  try {
    const response = await pool.query(
      `select id, company,balance, tier_id, tier_code, cdf_total_due FROM cdf where COALESCE(is_deleted,false) = false and is_active = true and cdf_status = 'active'`
    );

    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const { customerId } = req.query;
    const response = await pool.query(
      `select id, company,balance, tier_id, tier_code, due_limit, cdf_total_due FROM cdf where COALESCE(is_deleted,false) = false and is_active = true and cdf_status = 'active' and id = ${customerId} limit 1`
    );
    if (response.rows && response.rows.length > 0) {
      return res.status(STATUS_CODE.SUCCESS).send(response.rows[0]);
    }
    return res.status(STATUS_CODE.ERROR).send({
      message: MESSAGES.COMMON.DATA_NOT_FOUND
    });
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
