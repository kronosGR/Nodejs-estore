const express = require('express');

const db = require('../models');
const OrderService = require('../services/OrderService');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();
const orderService = new OrderService(db);

router.get('/all', isAdmin, async (req, res, next) => {
  const orders = await orderService.getAllOrders();
  return res.jsend.success({ data: { statusCode: 200, result: orders } });
});

module.exports = router;
