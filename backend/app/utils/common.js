const jwt = require('jsonwebtoken');
const { RESPONSE_STATUS } = require('../constant/response-status');
const config = require('./../../app/config/db.config');

exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jsonWebToken.privateKey);
    return { status: RESPONSE_STATUS.SUCCESS, data: decoded };
  } catch (error) {
    return { status: RESPONSE_STATUS.FAIL, message: error.message };
  }
};

exports.generateToken = (payload, signInOptions = {}) => {
  try {
    const token = jwt.sign({ ...payload }, config.jsonWebToken.privateKey, {
      ...signInOptions
    });
    return { status: RESPONSE_STATUS.SUCCESS, data: token };
  } catch (error) {
    return { status: RESPONSE_STATUS.FAIL, message: error.message };
  }
};
