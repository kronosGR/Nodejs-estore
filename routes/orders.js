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
  // #swagger.tags = ['Orders']
  // #swagger.description = "Get All Orders for all users"
  // #swagger.produces = ['text/json']
  /* #swagger.responses [200] = {
    schema:{
     "status": "success",
            "data": {
                "data": {
                    "statusCode": 200,
                    "result": [
                        {
                            "id": "7a48ebdc",
                            "total": 69,
                            "cartId": 3,
                            "createdAt": "2023-11-30T07:48:26.000Z",
                            "updatedAt": "2023-11-30T07:48:26.000Z",
                            "OrderStatusId": 1,
                            "UserId": 2,
                            "OrderItems": [
                                {
                                    "id": 41,
                                    "productId": 2,
                                    "quantity": 1,
                                    "unitPrice": 69,
                                    "createdAt": "2023-11-30T07:48:26.000Z",
                                    "updatedAt": "2023-11-30T07:48:26.000Z",
                                    "OrderId": "7a48ebdc"
                                }
                            ],
                            "OrderStatus": {
                                "id": 1,
                                "name": "In Progress",
                                "createdAt": "2023-11-28T15:59:06.000Z",
                                "updatedAt": "2023-11-28T15:59:06.000Z"
                            }
                        },
                        {
                            "id": "bda97690",
                            "total": 207,
                            "cartId": 1,
                            "createdAt": "2023-11-28T17:21:50.000Z",
                            "updatedAt": "2023-11-29T11:08:19.000Z",
                            "OrderStatusId": 1,
                            "UserId": 2,
                            "OrderItems": [
                                {
                                    "id": 40,
                                    "productId": 1,
                                    "quantity": 2,
                                    "unitPrice": 69,
                                    "createdAt": "2023-11-28T17:21:50.000Z",
                                    "updatedAt": "2023-11-28T17:21:50.000Z",
                                    "OrderId": "bda97690"
                                }
                            ],
                            "OrderStatus": {
                                "id": 1,
                                "name": "In Progress",
                                "createdAt": "2023-11-28T15:59:06.000Z",
                                "updatedAt": "2023-11-28T15:59:06.000Z"
                            }
                        }
                    ]
                }
            }
          }
    }
*/
  const orders = await orderService.getAllOrders();
  return res.jsend.success({ data: { statusCode: 200, result: orders } });
});

// get all orders for user
router.get('/', isRegisteredUser, async (req, res, next) => {
  // #swagger.tags = ['Orders']
  // #swagger.description = "Get All Orders for a user"
  // #swagger.produces = ['text/json']
  /* #swagger.responses [200] = {
    schema:{
     "status": "success",
            "data": {
                "data": {
                    "statusCode": 200,
                    "result": [
                        {
                            "id": "7a48ebdc",
                            "total": 69,
                            "cartId": 3,
                            "createdAt": "2023-11-30T07:48:26.000Z",
                            "updatedAt": "2023-11-30T07:48:26.000Z",
                            "OrderStatusId": 1,
                            "UserId": 2,
                            "OrderItems": [
                                {
                                    "id": 41,
                                    "productId": 2,
                                    "quantity": 1,
                                    "unitPrice": 69,
                                    "createdAt": "2023-11-30T07:48:26.000Z",
                                    "updatedAt": "2023-11-30T07:48:26.000Z",
                                    "OrderId": "7a48ebdc"
                                }
                            ],
                            "OrderStatus": {
                                "id": 1,
                                "name": "In Progress",
                                "createdAt": "2023-11-28T15:59:06.000Z",
                                "updatedAt": "2023-11-28T15:59:06.000Z"
                            }
                        },
                        {
                            "id": "bda97690",
                            "total": 207,
                            "cartId": 1,
                            "createdAt": "2023-11-28T17:21:50.000Z",
                            "updatedAt": "2023-11-29T11:08:19.000Z",
                            "OrderStatusId": 1,
                            "UserId": 2,
                            "OrderItems": [
                                {
                                    "id": 40,
                                    "productId": 1,
                                    "quantity": 2,
                                    "unitPrice": 69,
                                    "createdAt": "2023-11-28T17:21:50.000Z",
                                    "updatedAt": "2023-11-28T17:21:50.000Z",
                                    "OrderId": "bda97690"
                                }
                            ],
                            "OrderStatus": {
                                "id": 1,
                                "name": "In Progress",
                                "createdAt": "2023-11-28T15:59:06.000Z",
                                "updatedAt": "2023-11-28T15:59:06.000Z"
                            }
                        }
                    ]
                }
            }
          }
    }
*/
  const userId = getIdFromToken(req);
  const orders = await orderService.getAllOrdersForUser(id);
  return res.jsend.success({ data: { statusCode: 200, retult: orders } });
});

// update orderStatus
router.put('/:orderId', isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Orders']
  // #swagger.description = "Change Order status"
  // #swagger.produces = ['text/json']
  /*  #swagger.parameters['orderId']={
      in: 'path',
      description: 'Order Id',
      name : 'orderId',
      type: 'string',
      example:1
     } 
    #swagger.parameters['body']={
      in: 'body',
       schema: {
                OrderStatusId: '2',
            }
     } 
     #swagger.responses[200] = {
      schema:{
        "status":"success",
        "data":{
          "data":
          {
            "statusCode":200,
            "result":"Order updated"
          }
        }
      }
    }
     #swagger.responses[400] = {
      description: 'Order Status is required',
    }
     #swagger.responses[500] = {
    }
    */
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
