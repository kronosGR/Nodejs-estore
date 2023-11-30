const express = require('express');

const db = require('../models');
const OrderStatusService = require('../services/OrderStatusService');

const router = express.Router();
const orderStatusService = new OrderStatusService(db);

router.get('/', async (req, res, next) => {
  // #swagger.tags = ['Order Status']
  // #swagger.description = "Get All Order Statuses"
  // #swagger.produces = ['text/json']
  /* #swagger.responses [200] = {
    schema:{
        "status": "success",
        "data": {
            "data": {
                "statusCode": 200,
                "result": [
                    {
                        "id": 1,
                        "name": "In Progress",
                        "createdAt": "2023-11-28T15:59:06.000Z",
                        "updatedAt": "2023-11-28T15:59:06.000Z"
                    },
                    {
                        "id": 2,
                        "name": "Ordered",
                        "createdAt": "2023-11-28T15:59:06.000Z",
                        "updatedAt": "2023-11-28T15:59:06.000Z"
                    },
                    {
                        "id": 3,
                        "name": "Completed",
                        "createdAt": "2023-11-28T15:59:06.000Z",
                        "updatedAt": "2023-11-28T15:59:06.000Z"
                    }
                ]
            }
        }
      }
  }
  */
  const statuses = await orderStatusService.getAllOrderStatus();
  return res.jsend.success({ data: { statusCode: 200, result: statuses } });
});

module.exports = router;
