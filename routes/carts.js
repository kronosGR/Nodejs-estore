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
  const id = getIdFromToken(req);
  const carts = await cartService.getCartsForUser(id);
  if (!carts) {
    return next(createHttpError(404, 'No carts found'));
  }
  return res.jsend.success({ data: { statusCode: 200, result: carts } });
});

// get specific cart
router.get('/:cartId', async (req, res, next) => {
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
    return next(createHttpError(400, 'No cart found'));
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
  const cartId = req.params.cartId;
  const { productId, quantity, unitPrice } = req.body;
  const id = getIdFromToken(req);

  if (isEmpty(productId) || isEmpty(quantity) || isEmpty(unitPrice)) {
    return next(createHttpError(400, 'All fields are required'));
  }
  // check product quantity
  const cQuantity = await productService.getProductQuantity(productId);
  if (cQuantity <= 0) {
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
    return next(createHttpError(400, 'No cart found'));
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
  const cartId = req.params.cartId;
  const cart = await cartItemService.getItemsFromCart(cartId);
  if (!cart) {
    return next(createHttpError(404, 'No cart found'));
  }
  return res.jsend.success({ data: { statusCode: 200, result: cart } });
});

module.exports = router;
