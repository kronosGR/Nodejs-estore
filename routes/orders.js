const express = require('express');

const db = require('../models');
const OrderService = require('../services/OrderService');
const isAdmin = require('../middleware/isAdmin');
const isRegisteredUser = require('../middleware/isRegisteredUser');
const getIdFromToken = require('../utils/getIdFromToken');
const isEmpty = require('../utils/isEmpty');
const createHttpError = require('http-errors');

const router = express.Router();
const orderService = new OrderService(db);

// get all orders by admin
router.get('/all', isAdmin, async (req, res, next) => {
  const orders = await orderService.getAllOrders();
  return res.jsend.success({ data: { statusCode: 200, result: orders } });
});

// get all orders for user
router.get('/', isRegisteredUser, async (req, res, next) => {
  const userId = getIdFromToken(req);
  const orders = await orderService.getAllOrdersForUser(id);
  return res.jsend.success({ data: { statusCode: 200, retult: orders } });
});

// update orderStatus
router.put('/:orderId', isAdmin, async (req, res, next) => {
  const orderId = req.params.orderId;
  const { OrderStatusId } = req.body;
  if (isEmpty(OrderStatusId)) {
    return next(createHttpError(400, 'Order Status is required'));
  }

  const ret = await orderService.changeOrderStatus(orderId, OrderStatusId);
  if (ret.errors) {
    const errorMsg = ret.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 200, result: 'Order updated' } });
});
module.exports = router;
