const { MESSAGES } = require('./../constant/messages');
const { STATUS_CODE } = require('./../constant/response-status');
const { generateToken } = require('../utils/common');
const { pool } = require('./../db');

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }

    const response = await pool.query(
      `select * from users where "password" = '${password}' and user_name  = '${userName}'`
    );

    if (response.rows.length === 0) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.AUTH.USER_NOT_FOUND });
      return;
    }
    const user = response.rows[0];
    if (user.is_active === false) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.AUTH.ACCOUNT_DEACTIVATED });
      return;
    }
    const token = generateToken(
      { id: user.id, userName: user.user_name, role: user.role },
      { expiresIn: 86400 }
    ).data;

    res.status(STATUS_CODE.SUCCESS).send({ ...user, token });
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const { orderBy, direction, pageSize, pageNumber, search, active } =
      req.query;
    const { tokenData } = res.locals;
    const offset = pageSize * pageNumber - pageSize;
    let searchQuery = 'where true';
    if (search) {
      searchQuery += ` and
        (user_name like lower('%${search}%')
          or mobile_number::text like '%${search}%'
          or balance::text like '%${search}%'
          or role like '%${search}%'
        )`;
    }
    searchQuery += ` and is_active = ${active}`;
    if (tokenData.role.toLowerCase() !== 'owner') {
      searchQuery += ` and id = ${tokenData.id}`;
    }
    const response = await pool.query(
      `select count(id) over() as total, id ,user_name, "role", mobile_number, balance, "permission", "password", is_active from users ${searchQuery} order by ${orderBy} ${direction} OFFSET ${offset} LIMIT ${pageSize}`
    );
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
    await pool.query(`update users set is_deleted = true where "id" = '${id}'`);
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
    await pool.query(`UPDATE users
        SET is_active = ${status} where "id" = '${id}'`);
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.add = async (req, res) => {
  try {
    const { userName, role, mobileNumber, balance, password, permission } =
      req.body;

    if (!userName || !role || !mobileNumber || !balance || !password) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }

    const sql1 = `select id from users where user_name = '${userName}'`;
    const users = await pool.query(sql1);
    if (users.rows > 0) {
      res.status(STATUS_CODE.BAD).send({ message: MESSAGES.AUTH.USER_EXITS });
    }

    const query = `INSERT INTO users
    (user_name, "role", mobile_number, balance, "password", permission)
    VALUES('${userName}', '${role}', '${mobileNumber}', '${balance}', '${password}', '${JSON.stringify(
      permission
    )}'); `;

    await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id, userName, role, mobileNumber, balance, password, permission } =
      req.body;
    if (!id || !mobileNumber || !password) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }

    await pool.query(
      `UPDATE users
      SET mobile_number='${mobileNumber}', "password"='${password}', permission = '${JSON.stringify(
        permission
      )}' where id = ${id};
       `
    );

    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.getUserDropDown = async (req, res) => {
  try {
    const loggedInUserId = res.locals.tokenData.id;
    const {loggedInUser} = req.query;
    let whereClause = ' where is_deleted = false and is_active = true ';
    if (loggedInUser === 'false'){
      whereClause += `and id != ${loggedInUserId}`
    }
    let query = `select id, user_name FROM users ${whereClause} `
    const response = await pool.query(query);
    res.status(STATUS_CODE.SUCCESS).send(response.rows);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.onCheckUserName = async (req, res) => {
  try {
    const { userName } = req.body;
    const response =
      await pool.query(`select id from users where lower(user_name) = trim(lower('${userName}'))
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
