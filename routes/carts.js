const express = require('express');

require('dotenv').config();
const db = require('../models');
const CartService = require('../services/CartService');
const CartItemService = require('../services/CartItemService');
const ProductService = require('../services/ProductService');
const UserService = require('../services/UserService');
const createHttpError = require('http-errors');
const isEmpty = require('../utils/isEmpty');
const isRegisteredUser = require('../middleware/isRegisteredUser');
const getIdFromToken = require('../utils/getIdFromToken');

const router = express.Router();
const cartService = new CartService(db);
const cartItemService = new CartItemService(db);
const productService = new ProductService(db);
const userService = new UserService(db);

// get carts
router.get('/', async (req, res, next) => {
  // #swagger.tags = ['Carts']
  // #swagger.description = "Get All Carts"
  // #swagger.produces = ['text/json']
  /*  #swagger.responses[200] = {
       schema: {
        "status": "success",
        "data": {
            "data": {
                "statusCode": 200,
                "result": [
                    {
                        "id": 2,
                        "total": 0,
                        "isCheckedOut": false,
                        "createdAt": "2023-11-30T04:49:29.000Z",
                        "updatedAt": "2023-11-30T04:49:29.000Z",
                        "UserId": 1,
                        "CartItems": []
                    }
                ]
            }
        }
    }
  }
     #swagger.responses[404] = {
      description: 'Not carts found',
    }
  */
  const id = getIdFromToken(req);
  const carts = await cartService.getCartsForUser(id);
  if (!carts) {
    return next(createHttpError(404, 'No carts found'));
  }
  return res.jsend.success({ data: { statusCode: 200, result: carts } });
});

// get specific cart
router.get('/:cartId', async (req, res, next) => {
  // #swagger.tags = ['Carts']
  // #swagger.description = "Get Cart"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['cartId']={
      in: 'path',
      description: 'Cart Id',
      name : 'cartId',
      type: 'number',
      example:1
     } 
      #swagger.responses[200] = {
       schema: {
        "status": "success",
        "data": {
            "data": {
                "statusCode": 200,
                "result": [
                    {
                        "id": 2,
                        "total": 0,
                        "isCheckedOut": false,
                        "createdAt": "2023-11-30T04:49:29.000Z",
                        "updatedAt": "2023-11-30T04:49:29.000Z",
                        "UserId": 1,
                        "CartItems": []
                    }
                ]
            }
        }
    }
  }
     #swagger.responses[404] = {
      description: 'Not cart found',
    }
  */
  const cartId = req.params.cartId;
  const id = getIdFromToken(req);
  const cart = await cartService.getCartForUser(id, cartId);
  if (!cart) {
    return next(createHttpError(404, 'No cart found'));
  }
  return res.jsend.success({ data: { statusCode: 200, result: cart } });
});

// add new cart
router.post('/', async (req, res, next) => {
  // #swagger.tags = ['Carts']
  // #swagger.description = "Add new Cart"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['body']={
      in: 'body',
       schema: {
                "total": 0,
                "isCheckedOut":0
              }           
     } 
      #swagger.responses[201] = {
       schema: {
                "status": "success",
                "data": {
                    "data": {
                        "statusCode": 201,
                        "result": "Cart added",
                        "data": {
                            "id": 2,
                            "total": 0,
                            "UserId": 1,
                            "isCheckedOut": false,
                            "updatedAt": "2023-11-30T04:49:29.564Z",
                            "createdAt": "2023-11-30T04:49:29.564Z"
                        }
                    }
                }
              }
     #swagger.responses[400] = {
      description: 'All fields are required',
    }

     #swagger.responses[500]
  */
  let { total, isCheckedOut } = req.body;
  const id = getIdFromToken(req);

  if (isEmpty(total) || isEmpty(isCheckedOut)) {
    return next(createHttpError(400, 'All fields are required'));
  }

  const ret = await cartService.addCart(id, total, isCheckedOut);
  if (ret.errors) {
    const errorMsg = ret.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({
    data: { statusCode: 201, result: 'Cart added', data: ret },
  });
});

//delete cart
router.delete('/:cartId', async (req, res, next) => {
  // #swagger.tags = ['Carts']
  // #swagger.description = "Delete a Cart"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['cartId']={
      in: 'path',
      description: 'Cart Id',
      name : 'cartId',
      type: 'number',
      example:1
     } 
     #swagger.responses[200] = {
      description: 'Cart deleted',
    }
     #swagger.responses[404] = {
      description: 'Not found',
    }
     #swagger.responses[500] = {
      description: 'The cart is being used',
    }
    */
  const cartId = req.params.cartId;
  try {
    const res = await cartService.deleteCart(cartId);
    if (res.name == 'SequelizeForeignKeyConstraintError') {
      return next(createHttpError(500, 'The cart is being used'));
    }
  } catch (e) {
    return next(createHttpError(500, 'There was an error deleting the cart'));
  }
  res.jsend.success({ statusCode: 200, result: 'Cart deleted' });
});

//update item in cart
router.put('/:cartId/cartitem/:cartItemId', async (req, res, next) => {
  // #swagger.tags = ['Carts']
  // #swagger.description = "Update a Cart Item"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['cartId']={
      in: 'path',
      description: 'Cart Id',
      name : 'cartId',
      type: 'number',
      example:1
     } 
    #swagger.parameters['cartItemId']={
        in: 'path',
        description: 'Cart Item Id',
        name : 'cartItemId',
        type: 'number',
        example:1
     } 
      #swagger.responses[200] = {
          description: 'Item updated',
        }
        #swagger.responses[400] = {
          description: 'All fields are required',
        }
        #swagger.responses[404] = {
          description: 'No cart found',
        }
        #swagger.responses[403] = {
          description: 'The cart was checked out, you can update it',
      }
     */
  const cartId = req.params.cartId;
  const cartItemId = req.params.cartItemId;
  const { productId, quantity, unitPrice } = req.body;
  const id = getIdFromToken(req);

  if (isEmpty(productId) || isEmpty(quantity) || isEmpty(unitPrice)) {
    return next(createHttpError(400, 'All fields are required'));
  }
  // get user discount
  const membership = await userService.getUserDiscount(id);
  const discount = membership.discount;
  // calculate the new item price
  let newUnitPrice = unitPrice - (unitPrice * discount) / 100;

  const cartOld = await cartService.getCartForUser(id, cartId);
  if (cartOld && cartOld.isCheckedOut) {
    return next(createHttpError(403, 'The cart was checked out, you can update it'));
  }

  if (quantity == 0) {
    // delete cart item
    await cartItemService.deleteCartItem(cartItemId);
  } else {
    // update it
    await cartItemService.updateItemInCart(cartId, productId, quantity, newUnitPrice);
  }
  // update cart total
  const cart = await cartService.getCartForUser(id, cartId);
  if (!cart) {
    return next(createHttpError(404, 'No cart found'));
  }
  const cartItems = cart.CartItems;
  let total = 0;
  cartItems.forEach((item) => {
    total += item.quantity * item.unitPrice;
  });
  await cartService.updateCartForUser(cartId, total);
  return res.jsend.success({
    data: { statusCode: 200, result: 'Item updated' },
  });
});

// add item to cart
router.post('/:cartId/cartitem', async (req, res, next) => {
  // #swagger.tags = ['Carts']
  // #swagger.description = "Add a Cart Item"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['body']={
      in: 'body',
       schema: {
          "productId": 2,
          "quantity":1,
          "unitPrice": 69
        }
     } 
     #swagger.responses[200] = {
      description: 'Item(s) added to cart'
    }
     #swagger.responses[400] = {
      description: 'All fields are required',
    }    
     #swagger.responses[403] = {
       description: 'The cart was checked out, you can update it',
    }
     #swagger.responses[404] = {
      description: 'No cart found',
    }    
  */
  const cartId = req.params.cartId;
  const { productId, quantity, unitPrice } = req.body;
  const id = getIdFromToken(req);

  if (isEmpty(productId) || isEmpty(quantity) || isEmpty(unitPrice)) {
    return next(createHttpError(400, 'All fields are required'));
  }
  // check product quantity
  const cQuantity = await productService.getProduct(productId);
  if (cQuantity.quantity <= 0) {
    return next(createHttpError(400, 'Product is out of stock'));
  }

  // get user discount
  const membership = await userService.getUserDiscount(id);
  const discount = membership.discount;
  // calculate the new item price
  let newUnitPrice = unitPrice - (unitPrice * discount) / 100;

  const cartOld = await cartService.getCartForUser(id, cartId);
  if (cartOld && cartOld.isCheckedOut) {
    return next(createHttpError(403, 'The cart was checked out, you can update it'));
  }

  // add/update product to cartItem
  const cartItem = await cartItemService.getItemFromCart(productId, cartId);
  if (cartItem) {
    // increase by one quantity
    let newQuantity = cartItem.quantity + quantity;
    const updatedCartItem = await cartItemService.updateItemInCart(
      cartId,
      productId,
      newQuantity,
      newUnitPrice
    );
  } else {
    // add item to cart
    await cartItemService.addItemToCart(cartId, productId, quantity, newUnitPrice);
  }

  // update cart total
  const cart = await cartService.getCartForUser(id, cartId);
  if (!cart) {
    return next(createHttpError(404, 'No cart found'));
  }
  const cartItems = cart.CartItems;
  let total = 0;
  cartItems.forEach((item) => {
    total += item.quantity * item.unitPrice;
  });
  await cartService.updateCartForUser(cartId, total);
  return res.jsend.success({
    data: { statusCode: 200, result: 'Item(s) added to cart' },
  });
});

router.get('/:cartId/cartitems', async (req, res, next) => {
  // #swagger.tags = ['Carts']
  // #swagger.description = "Get all Cart Items"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['cartId']={
      in: 'path',
      description: 'Cart Id',
      name : 'cartId',
      type: 'number',
      example:1
     } 
     #swagger.responses[200] = {
      schema:{
              "status": "success",
              "data": {
                  "data": {
                      "statusCode": 200,
                      "result": [
                          {
                              "id": 4,
                              "productId": 2,
                              "quantity": 1,
                              "unitPrice": 48.3,
                              "createdAt": "2023-11-30T05:04:26.000Z",
                              "updatedAt": "2023-11-30T05:04:26.000Z",
                              "CartId": 2
                          }
                      ]
                  }
              }
          }
    }
     #swagger.responses[404] = {
      description: 'Not cart found',
    }

 */
  const cartId = req.params.cartId;
  const cart = await cartItemService.getItemsFromCart(cartId);
  if (!cart) {
    return next(createHttpError(404, 'No cart found'));
  }
  return res.jsend.success({ data: { statusCode: 200, result: cart } });
});

module.exports = router;
