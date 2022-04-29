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
        (company ilike '%${search}%'
          or name ilike '%${search}%'
          or address ilike '%${search}%'
          or email ilike '%${search}%'
          or mobile ilike '%${search}%'
          or due_limit ilike '%${search}%'
          or balance ilike '%${search}%'
          or other ilike '%${search}%'
          or tier ilike '%${search}%'
        )`;
        }
        searchQuery += ` and c.is_active = ${active}`;

        const response = await pool.query(
            `
            SELECT
                Count(c.id) OVER() AS total,
                c.id,
                company,
                name,
                address,
                email,
                mobile,
                due_limit,
                balance,
                other,
                tier_id as tier_id,
                t.NAME AS tier_name,
                t.code as tier_code
            FROM
                customers c
                JOIN
                tiers t
                ON t.id = c.tier_id
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
        await pool.query(`UPDATE customers
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
            company,
            name,
            address,
            email,
            mobile,
            dueLimit,
            balance,
            other,
            tierId
        } = req.body;

        if (!company ||
            !name ||
            !address ||
            !email ||
            !mobile ||
            !dueLimit ||
            !tierId
        ) {
            res
                .status(STATUS_CODE.BAD)
                .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
            return;
        }
        await pool.query(
            `INSERT INTO customers
      (company, name, address, email, mobile, due_limit, balance, other, tier_id)
      VALUES('${company}', '${name}', '${address}', '${email}', '${mobile}', '${dueLimit}', '${balance}', '${other}', '${tierId}');
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
            company,
            name,
            address,
            email,
            mobile,
            dueLimit,
            balance,
            other,
            tierId
        } = req.body;
        if (!company ||
            !name ||
            !address ||
            !email ||
            !mobile ||
            !dueLimit ||
            !tierId ||
            !id
        ) {
            res
                .status(STATUS_CODE.BAD)
                .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
            return;
        }
        await pool.query(
            `UPDATE customers
      SET company='${company}', name='${name}', address='${address}', email='${email}', mobile='${mobile}', due_limit='${dueLimit}', balance='${balance}', other='${other}', tier_id='${tierId}' where id = ${id};
       `
        );

        res.status(STATUS_CODE.SUCCESS).send();
    } catch (error) {
        res.status(STATUS_CODE.ERROR).send({
            message: error.message || MESSAGES.COMMON.ERROR
        });
    }
};

exports.getCustomerDropDown = async(req, res) => {
    try {
        const response = await pool.query(`select id, company FROM customers where is_deleted = false and is_active = true`);

        res.status(STATUS_CODE.SUCCESS).send(response.rows);
    } catch (error) {
        res.status(STATUS_CODE.ERROR).send({
            message: error.message || MESSAGES.COMMON.ERROR
        });
    }
};


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
