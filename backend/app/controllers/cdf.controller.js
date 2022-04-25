const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');
exports.findAll = async(req, res) => {
    try {
        const { orderBy, direction, pageSize, pageNumber, search, active } = req.query;
        let searchQuery = 'where true';
        const offset = pageSize * pageNumber - pageSize;
        if (search) {
            searchQuery += ` and
        (email ilike '%${search}%'
          or name ilike '%${search}%'
          or company ilike '%${search}%'
          or date::text ilike '%${search}%'
          or reference ilike '%${search}%'
          or reference_person ilike '%${search}%'
          or brands ilike '%${search}%'
          or display_names ilike '%${search}%'
          or platforms ilike '%${search}%'
          or other ilike '%${search}%'
          or mobile::text ilike '%${search}%'
          or address ilike '%${search}%'
        )`;
        }
        searchQuery += ` and c.is_active = ${active}`;
        const response = await pool.query(
            `
            SELECT
                Count(c.id) OVER() AS total,
                c.id,
                  email,
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
                  address
            FROM
                cdf c
            ${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}`
        );
        res.status(STATUS_CODE.SUCCESS).send(response.rows);
    } catch (error) {
        res.status(STATUS_CODE.ERROR).send({
            message: error.message || MESSAGES.COMMON.ERROR
        });
    }
};
exports.delete = async(req, res) => {
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
exports.add = async(req, res) => {
    try {
        const {
          email,
          name,
          company,
          date,
          reference ,
          referencePerson ,
          brands ,
          displayNames ,
          platforms ,
          other ,
          mobile ,
          address
        } = req.body;
        if (    !email ||
          !name||
          !company||
          !date||
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
exports.update = async(req, res) => {
    try {
        const {
            id,
            email,
          name,
          company,
          date,
          reference ,
          referencePerson ,
          brands ,
          displayNames ,
          platforms ,
          other ,
          mobile ,
          address
        } = req.body;
        if (  !email ||
          !name||
          !company||
          !date||
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
exports.changeStatus = async(req, res) => {
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

exports.changeCdfStatus = async(req, res) => {
    try {
        const { id, status } = req.body;
        if (!id) {
            res
                .status(STATUS_CODE.BAD)
                .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
            return;
        }
        await pool.query(`UPDATE cdf
      SET cdf_status = ${status} where "id" = '${id}'`);
        res.status(STATUS_CODE.SUCCESS).send();
    } catch (error) {
        res.status(STATUS_CODE.ERROR).send({
            message: error.message || MESSAGES.COMMON.ERROR
        });
    }
};
