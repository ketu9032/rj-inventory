const express = require('express');
const router = new express.Router();
const users = require('./../controllers/user.controller');
const { STATUS_CODE, RESPONSE_STATUS } = require('../constant/response-status');
const { MESSAGES } = require('../constant/messages');
const { verifyToken } = require('../utils/common');

router.get('/', (req, res) => res.send('ok'));
router.post('/api/users/login', users.login);

router.use('/', async (req, res, next) => {
    const token = req.headers.authorization;
    const { status, data } = await verifyToken(token);
    if (status !== RESPONSE_STATUS.SUCCESS) {
       res
        .status(STATUS_CODE.UNAUTHORIZED)
        .send({ message: MESSAGES.AUTH.INVALID_TOKEN});
        return;
    }
    res.locals.tokenData = data;
    return next();
  });

router.delete('/api/users', users.delete);
router.get('/api/users', users.findAll);
router.post('/api/users', users.add);
router.put('/api/users', users.update);


module.exports = router;
