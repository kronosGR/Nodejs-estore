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

router.get('/:userId', async (req, res, next) => {
  const userId = req.params.userId;
  const cart = await cartService.getCartForUser(userId);
  if (!cart) {
    return next(createHttpError(404, 'No cart found'));
  }
  return res.jsend.success({ data: { statusCode: 200, result: cart } });
});

router.post('/:cartId', isRegisteredUser, async (req, res, next) => {
  const cartId = req.params.cartId;
  let { productId, quantity, unitPrice } = req.body;

  const token = req.cookies.token || '';
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

  if (isEmpty(productId) || isEmpty(quantity) || isEmpty(unitPrice)) {
    return next(createHttpError(400, 'All fields are required'));
  }

  // get user discount
  const membership = await userService.getUserDiscount(decodedToken.id);
  const discount = membership.discount;

  // calculate the new item price
  unitPrice = unitPrice - (unitPrice * discount) / 100;

  // add/update product to cartItem
  const cartItem = await cartItemService.getItemFromCart(productId, cartId);
  if (cartItem) {
    // increase by one quantity

    const updatedCartItem = await cartItemService.updateItemInCart(
      cartId,
      productId,
      newQuantity,
      unitPrice
    );
  } else {
    // add item to cart
    await cartItemService.addItemToCart(cartId, productId, quantity, unitPrice);
  }

  // update cart total
  const cart = await cartService.getCartForUser(decodedToken.id);
  const cartItems = cart.CartItems;
  let total = 0;
  cartItems.forEach((item) => {
    total += item.quantity * item.unitPrice;
  });
  const resp = await cartService.updateCartForUser(cartId, total);
  return res.jsend.success({
    data: { statusCode: 200, result: 'Item(s) added to cart' },
  });
});

module.exports = router;

// check product quantity
// const cQuantity = await productService.getProductQuantity(productId);
// if (cQuantity >= quantity) {
// } else {
//   return next(createHttpError(400, 'Not enough items to add to the Cart'));
// }
