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
const sales = require('./../controllers/sales.controller');
const sales_bill = require('./../controllers/sales_bill.controller')
const sales_quotation = require('./../controllers/sales_quotation.controller');
const sales_quotation_detail = require('./../controllers/sales_quotation_detail.controller');
const purchase = require('./../controllers/purchase.controller');
const purchase_details = require('./../controllers/purchase_details.controller')
router.post('/api/addSales', sales.addSales);


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
router.put('/api/transfers/approved', transfers.approved);

router.delete('/api/suppliers', suppliers.delete);
router.get('/api/suppliers', suppliers.findAll);
router.post('/api/suppliers', suppliers.add);
router.put('/api/suppliers', suppliers.update);
router.put('/api/suppliers/changeStatus', suppliers.changeStatus);
router.get('/api/supplierDropDown', suppliers.getSupplierDropDown);

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
router.put('/api/expense/approved', expense.approved);

router.delete('/api/item', item.delete);
router.get('/api/item', item.findAll);
router.post('/api/item', item.add);
router.put('/api/item', item.update);
router.get('/api/item/getItemDropDown', item.getItemDropDown);
router.put('/api/item/changeStatus', item.changeStatus);

router.delete('/api/item_supplier', item_supplier.delete);
router.get('/api/item_supplier', item_supplier.findAll);
router.post('/api/item_supplier', item_supplier.add);
router.put('/api/item_supplier', item_supplier.update);

router.delete('/api/cdf', cdf.delete);
router.get('/api/cdf', cdf.findAll);
router.post('/api/cdf', cdf.add);
router.put('/api/cdf', cdf.update);

router.put('/api/cdf/changeStatus', cdf.changeStatus);
router.put('/api/cdf/changeCdfStatus', cdf.changeCdfStatus);
router.put('/api/cdf/cdfTOCustomersUpdate', cdf.cdfTOCustomersUpdate);
router.put('/api/cdf/onCheckEmail', cdf.onCheckEmail);
router.put('/api/cdf/onCheckCompany', cdf.onCheckCompany);
router.put('/api/cdf/onCheckMobile', cdf.onCheckMobile);
router.get('/api/cdf/getCdfTOCustomerDropDown', cdf.getCdfTOCustomerDropDown);
router.get('/api/cdf/getCustomerById', cdf.getCustomerById);

router.delete('/api/sales', sales.delete);
router.get('/api/sales', sales.findAll);
router.post('/api/sales', sales.add);
router.post('/api/addSales', sales.addSales);
router.put('/api/sales', sales.update);
router.put('/api/sales/changeStatus', sales.changeStatus);
router.get('/api/sales/getSalesById', sales.getSalesById);
router.put('/api/sales/updateValue', sales.updateValue);
router.get('/api/sales/isCustomerIdInSales', sales.isCustomerIdInSales);

router.delete('/api/sales_bill', sales_bill.delete);
router.get('/api/sales_bill', sales_bill.findAll);
router.post('/api/sales_bill', sales_bill.add);
router.put('/api/sales_bill', sales_bill.update);

router.delete('/api/sales_quotation', sales_quotation.delete);
router.get('/api/sales_quotation', sales_quotation.findAll);
router.post('/api/sales_quotation', sales_quotation.add);
router.put('/api/sales_quotation', sales_quotation.update);
router.put('/api/sales_quotation/changeStatus', sales_quotation.changeStatus);

router.delete('/api/sales_quotation_detail', sales_quotation_detail.delete);
router.get('/api/sales_quotation_detail', sales_quotation_detail.findAll);
router.post('/api/sales_quotation_detail', sales_quotation_detail.add);
router.put('/api/sales_quotation_detail', sales_quotation_detail.update);

router.delete('/api/purchase', purchase.delete);
router.get('/api/purchase', purchase.findAll);
router.post('/api/purchase', purchase.add);
router.put('/api/purchase', purchase.update);
router.put('/api/purchase/changeStatus', purchase.changeStatus);

router.delete('/api/purchase_details', purchase_details.delete);
router.get('/api/purchase_details', purchase_details.findAll);
router.post('/api/purchase_details', purchase_details.add);
router.put('/api/purchase_details', purchase_details.update);

module.exports = router;
