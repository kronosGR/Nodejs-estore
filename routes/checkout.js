const express = require('express');
const createHttpError = require('http-errors');
const getIdFromToken = require('../utils/getIdFromToken');
const crypto = require('crypto');

const db = require('../models');
const CartService = require('../services/CartService');
const ProductService = require('../services/ProductService');
const UserService = require('../services/UserService');
const OrderService = require('../services/OrderService');
const OrderItemService = require('../services/OrderItemService');
const MembershipService = require('../services/MembershipService');

const router = express.Router();
const cartService = new CartService(db);
const productService = new ProductService(db);
const userService = new UserService(db);
const orderService = new OrderService(db);
const orderItemService = new OrderItemService(db);
const membershipService = new MembershipService(db);

// TODO

// An endpoint is required for the Admin users to change the status of an order.

router.post('/now/:cartId', async (req, res, next) => {
  const cartId = req.params.cartId;
  const id = getIdFromToken(req);
  let totalPurchasedItems = 0;

  // get the cart
  const cart = await cartService.getCartForUser(id, cartId);
  if (cart.isCheckedOut) {
    return next(createHttpError(400, 'Cart is already checkout'));
  }

  const cartItems = cart.CartItems;

  if (cartItems.length == 0) {
    return next(createHttpError(400, 'No items in your cart'));
  }

  // check if the product quantity is enough
  for (const item of cartItems) {
    const product = await productService.getProduct(item.productId);
    if (product.quantity < item.quantity) {
      return next(
        createHttpError(400, 'No enough stock for the product ' + product.name)
      );
    }
  }

  // create new order with In progress id-1
  const orderId = crypto.randomBytes(4).toString('hex').toString(36);
  await orderService.addOrder(orderId, id, cart.total, cart.id, '1');

  // copy cart items to order items
  cartItems.forEach(async (item) => {
    totalPurchasedItems += item.quantity;
    await orderItemService.addItemToOrder(
      orderId,
      item.productId,
      item.quantity,
      item.unitPrice
    );

    // update product quantity
    const tmp = await productService.getProduct(item.productId);
    const newProdQuantity = tmp.quantity - item.quantity;
    await productService.updateProductQuantity(item.productId, newProdQuantity);
  });

  // update cart to checkout
  await cartService.updateCartForUser(cart.id, cart.total, 1);

  // get memberships
  const user = await userService.getUserById(id);
  const updatedPurchasedItems = totalPurchasedItems + user.itemsPurchased;
  const newMembership = await membershipService.getMembershipWithItemsPurchased(
    updatedPurchasedItems
  );

  console.log(newMembership);
  console.log(updatedPurchasedItems);

  // update items purchased and membership
  await userService.updateUserMembershipAndItems(
    id,
    newMembership.id,
    updatedPurchasedItems
  );

  return res.jsend.success({
    data: { statusCode: 200, result: 'Char has been checked-out', orderId: orderId },
  });
});

module.exports = router;
