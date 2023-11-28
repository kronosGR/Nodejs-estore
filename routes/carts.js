const express = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const db = require('../models');
const CartService = require('../services/CartService');
const CartItemService = require('../services/CartItemService');
const ProductService = require('../services/ProductService');
const UserService = require('../services/UserService');
const createHttpError = require('http-errors');
const isEmpty = require('../utils/isEmpty');
const isRegisteredUser = require('../middleware/isRegisteredUser');

const router = express.Router();
const cartService = new CartService(db);
const cartItemService = new CartItemService(db);
const productService = new ProductService(db);
const userService = new UserService(db);

// get carts
router.get('/', async (req, res, next) => {
  const token = req.cookies.token || '';
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const carts = await cartService.getCartsForUser(decodedToken.id);
  if (!carts) {
    return next(createHttpError(404, 'No carts found'));
  }
  return res.jsend.success({ data: { statusCode: 200, result: carts } });
});

// get specific cart
router.get('/:cartId', async (req, res, next) => {
  const cartId = req.params.cartId;
  const token = req.cookies.token || '';
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const cart = await cartService.getCartForUser(decodedToken.id, cartId);
  if (!cart) {
    return next(createHttpError(404, 'No cart found'));
  }
  return res.jsend.success({ data: { statusCode: 200, result: cart } });
});

// add new cart
router.post('/', async (req, res, next) => {
  let { total, isCheckedOut } = req.body;

  const token = req.cookies.token || '';
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

  if (isEmpty(total) || isEmpty(isCheckedOut)) {
    return next(createHttpError(400, 'All fields are required'));
  }

  const ret = await cartService.addCart(decodedToken.id, total, isCheckedOut);
  if (ret.errors) {
    const errorMsg = ret.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({
    data: { statusCode: 201, result: 'Cart added', data: ret },
  });
});

router.delete('/:cartId', async (req, res, next) => {
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

router.post('/:cartId/cartitem', async (req, res, next) => {
  const cartId = req.params.cartId;
  const { productId, quantity, unitPrice } = req.body;
  const token = req.cookies.token || '';
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

  if (isEmpty(productId) || isEmpty(quantity) || isEmpty(unitPrice)) {
    return next(createHttpError(400, 'All fields are required'));
  }
  // check product quantity
  const cQuantity = await productService.getProductQuantity(productId);
  if (cQuantity <= 0) {
    return next(createHttpError(400, 'Product is out of stock'));
  }

  // get user discount
  const membership = await userService.getUserDiscount(decodedToken.id);
  const discount = membership.discount;
  // calculate the new item price
  let newUnitPrice = unitPrice - (unitPrice * discount) / 100;

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
  const cart = await cartService.getCartForUser(decodedToken.id, cartId);

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

module.exports = router;
