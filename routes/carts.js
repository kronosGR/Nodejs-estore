const express = require('express');

const db = require('../models');
const CartService = require('../services/CartService');
const CartItemService = require('../services/CartItemService');
const ProductService = require('../services/ProductService');
const createHttpError = require('http-errors');
const isEmpty = require('../utils/isEmpty');

const router = express.Router();
const cartService = new CartService(db);
const cartItemService = new CartItemService(db);
const productService = new ProductService(db);

router.get('/:userId', async (req, res, next) => {
  const userId = req.params.userId;
  const cart = await cartService.getCartForUser(userId);
  if (!cart) {
    return next(createHttpError(404, 'No cart found'));
  }
  return res.jsend.success({ data: { statusCode: 200, result: cart } });
});

router.post('/:cartId', async (req, res, next) => {
  const cartId = req.params.cartId;
  const { productId, quantity, unitPrice } = req.body;
  if (isEmpty(productId) || isEmpty(quantity) || isEmpty(unitPrice)) {
    return next(createHttpError(400, 'All fields are required'));
  }

  // check product quantity
  const cQuantity = await productService.getProductQuantity(productId);
  if (cQuantity >= quantity) {
    // get user discount

    // calculate the new item price

    // add/update product to cartItem
    const cartItem = await cartItemService.getItemFromCart(productId, cartId);
    if (cartItem) {
      // increase by one quantity
    } else {
      // add item to cart
      await cartItemService.addItemToCart(cartId, productId, quantity, unitPrice);
    }
    console.log(cartItem);
  } else {
    return next(createHttpError(400, 'Not enough items to add to the Cart'));
  }
});

module.exports = router;
