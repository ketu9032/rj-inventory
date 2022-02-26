const Users = require('./../models/user.model');
const { MESSAGES } = require('./../constant/messages');
const { STATUS_CODE } = require('./../constant/response-status');
const { generateToken } = require('../utils/common');


exports.create = async (req, res) => {
  try {
    const { userName, firstName, lastName, email, password } =
      req.body;
    if (!userName || !password || !firstName || !lastName || !email) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const user = new Users({
      user_name: userName,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password
    });
    const response = await user.save(user);
    res.send(response);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const user = await Users.find({ email: username, password: password });
    if (user.length === 0) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.AUTH.USER_NOT_FOUND });
      return;
    }
    const token = generateToken({ password, username }, { expiresIn: 86400 }).data;

    res.status(STATUS_CODE.SUCCESS).send({...user[0]._doc, token});
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const response = await Users.find();
    res.send(response);
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.findUserName = async (req, res) => {
  try {
    const response = await Users.find({}, { user_name: 1 });
    res.send(response);
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
    await Users.remove({ _id: id });
    res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id, firstName, lastName, email, userName, password } =
      req.body;
    if (!id || !firstName || !lastName || !email || !userName || !password) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const userObject = await Users.find({
      _id: id
    });
    if (userObject.length === 0) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.AUTH.USER_NOT_FOUND });
    }
    if (userObject) {
      const user = new Users({
        _id: id,
        user_name: userName,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password
      });
      await Users.findByIdAndUpdate(id, user, { new: true });
      res.status(STATUS_CODE.SUCCESS).send();
      return;
    }
    res.status(STATUS_CODE.BAD).send({
      message: MESSAGES.AUTH.USER_NOT_FOUND
    });
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const {
      id: id,
      new_password: newPassword,
      old_password: oldPassword
    } = req.body;
    if (!newPassword || !oldPassword) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.COMMON.INVALID_PARAMETERS });
      return;
    }
    const userObject = await Users.find({ _id: id, password: oldPassword });
    if (userObject === 0) {
      res
        .status(STATUS_CODE.BAD)
        .send({ message: MESSAGES.AUTH.USER_NOT_FOUND });
      return;
    }
    if (userObject) {
      const user = new Users({
        _id: id,
        password: newPassword
      });
      await Users.findByIdAndUpdate(id, user, { new: true });
      res.status(STATUS_CODE.SUCCESS).send();
      return;
    }
    res.status(STATUS_CODE.BAD).send({
      message: MESSAGES.AUTH.USER_NOT_FOUND
    });
  } catch (error) {
    res.status(STATUS_CODE.ERROR).send({
      message: error.message || MESSAGES.COMMON.ERROR
    });
  }
};
