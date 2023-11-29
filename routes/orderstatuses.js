const express = require('express');

const db = require('../models');
const OrderStatusService = require('../services/OrderStatusService');

const router = express.Router();
const orderStatusService = new OrderStatusService(db);

router.get('/', async (req, res, next) => {
  const statuses = await orderStatusService.getAllOrderStatus();
  return res.jsend.success({ data: { statusCode: 200, result: statuses } });
});

module.exports = router;
