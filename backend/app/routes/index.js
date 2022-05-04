const express = require('express');
const router = new express.Router();
const users = require('./../controllers/user.controller');
const customers = require('./../controllers/customer.controller');
const transfers = require('./../controllers/transfer.controller');
const expense = require('./../controllers/expense.controller');
const suppliers = require('./../controllers/supplier.controller');
const categories = require('./../controllers/category.controller');
const item = require('./../controllers/item.controller');
const item_supplier = require('./../controllers/item-supplier.controller');
const cdf = require('./../controllers/cdf.controller');

const tiers = require('./../controllers/tier.controller');
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
      .send({ message: MESSAGES.AUTH.INVALID_TOKEN });
    return;
  }
  res.locals.tokenData = data;
  return next();
});

router.delete('/api/users', users.delete);
router.get('/api/users', users.findAll);
router.post('/api/users', users.add);
router.put('/api/users', users.update);
router.put('/api/users/changeStatus', users.changeStatus);
router.get('/api/getUserDropDown', users.getUserDropDown);

router.delete('/api/customers', customers.delete);
router.get('/api/customers', customers.findAll);
router.post('/api/customers', customers.add);
router.put('/api/customers', customers.update);
router.get('/api/getCustomerDropDown', customers.getCustomerDropDown);
router.put('/api/customers/changeStatus', customers.changeStatus);

router.delete('/api/tiers', tiers.delete);
router.get('/api/tiers', tiers.findAll);
router.post('/api/tiers', tiers.add);
router.put('/api/tiers', tiers.update);
router.get('/api/getTierDropDown', tiers.getTierDropDown);
router.put('/api/tiers/changeStatus', tiers.changeStatus);

router.delete('/api/transfers', transfers.delete);
router.get('/api/transfers', transfers.findAll);
router.post('/api/transfers', transfers.add);
router.put('/api/transfers', transfers.update);
router.put('/api/transfers/changeStatus', transfers.changeStatus);

router.delete('/api/suppliers', suppliers.delete);
router.get('/api/suppliers', suppliers.findAll);
router.post('/api/suppliers', suppliers.add);
router.put('/api/suppliers', suppliers.update);
router.put('/api/suppliers/changeStatus', suppliers.changeStatus);
router.put('/api/supplierDropDown', suppliers.getSupplierDropDown);

router.delete('/api/categories', categories.delete);
router.get('/api/categories', categories.findAll);
router.post('/api/categories', categories.add);
router.put('/api/categories', categories.update);
router.put('/api/categories/changeStatus', categories.changeStatus);
router.get('/api/getCategoryDropDown', categories.getCategoryDropDown);

router.delete('/api/expense', expense.delete);
router.get('/api/expense', expense.findAll);
router.post('/api/expense', expense.add);
router.put('/api/expense', expense.update);
router.put('/api/expense/changeStatus', expense.changeStatus);

router.delete('/api/item', item.delete);
router.get('/api/item', item.findAll);
router.post('/api/item', item.add);
router.put('/api/item', item.update);
router.get('/api/getItemDropDown', item.getItemDropDown);
router.put('/api/item/changeStatus', item.changeStatus);

router.delete('/api/item_supplier', item_supplier.delete);
router.get('/api/item_supplier', item_supplier.findAll);
router.post('/api/item_supplier', item_supplier.add);
router.put('/api/item_supplier', item_supplier.update);

router.delete('/api/cdf', cdf.delete);
router.get('/api/cdf', cdf.findAll);
router.post('/api/cdf', cdf.add);
router.put('/api/cdf', cdf.update);
//router.get('/api/getCustomerDropDown', cdf.getCdfDropDown);
router.put('/api/cdf/changeStatus', cdf.changeStatus);
router.put('/api/cdf/changeCdfStatus', cdf.changeCdfStatus);
router.put('/api/cdf/cdfTOCustomersUpdate', cdf.cdfTOCustomersUpdate);

module.exports = router;
