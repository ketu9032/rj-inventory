const { MESSAGES } = require('../constant/messages');
const { STATUS_CODE } = require('../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('../db');


exports.findAll = async(req, res) => {
    try {
        const { orderBy, direction, pageSize, pageNumber, search } = req.query;
        let searchQuery = 'where true'
        if (search) {
            searchQuery += ` and
        (company ilike '%${search}%'
          or first_name ilike '%${search}%'
          or address ilike '%${search}%'
          or email ilike '%${search}%'
          or mobile_no ilike '%${search}%'
          or due_limit ilike '%${search}%'
          or balance ilike '%${search}%'
          or other ilike '%${search}%'
          or tier ilike '%${search}%'
        )`
        }

        let offset = (pageSize * pageNumber) - pageSize;

        const response = await pool.query(
            `
            SELECT
                Count(c.id) OVER() AS total,
                c.id,
                company,
                first_name,
                address,
                email,
                mobile_no,
                due_limit,
                balance,
                other,
                t.NAME AS tier 
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
        await pool.query(
            `delete from customers where "id" = '${id}'`
        );
        res.status(STATUS_CODE.SUCCESS).send();
    } catch (error) {
        res.status(STATUS_CODE.ERROR).send({
            message: error.message || MESSAGES.COMMON.ERROR
        });
    }
};



exports.add = async(req, res) => {
    try {

        const { company, firstName, address, email, mobileNumber, dueLimit, balance, other, tier } = req.body;

        if (!company || !firstName || !address || !email || !mobileNumber || !dueLimit || !tier) {
            res
                .status(STATUS_CODE.BAD)
                .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
            return;
        }
        await pool.query(
            `INSERT INTO customers
      (company, first_name, address, email, mobile_no, due_limit, balance, other, tier)
      VALUES('${company}', '${firstName}', '${address}', '${email}', '${mobileNumber}', '${dueLimit}', '${balance}', '${other}', '${tier}');
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
        const { id, company, firstName, address, email, mobileNumber, dueLimit, balance, other, tier } = req.body;
        if (!company || !firstName || !address || !email || !mobileNumber || !dueLimit || !tier) {
            res
                .status(STATUS_CODE.BAD)
                .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
            return;
        }
        await pool.query(
            `UPDATE customers
      SET company='${company}', first_name='${firstName}', address='${address}', email='${email}', mobile_no='${mobileNumber}', due_limit='${dueLimit}', balance='${balance}', other='${other}', tier='${tier}' where id = ${id};
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

        const response = await pool.query(
            `select id, company FROM customers `
        );

        res.status(STATUS_CODE.SUCCESS).send(response.rows);
    } catch (error) {
        res.status(STATUS_CODE.ERROR).send({
            message: error.message || MESSAGES.COMMON.ERROR
        });
    }
};