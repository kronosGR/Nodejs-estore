const express = require('express');
const crypto = require('crypto');
const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');

const db = require('../models');
const UserService = require('../services/UserService');
const CartService = require('../services/CartService');
const isValidEmail = require('../middleware/isValidEmail');
const isEmail = require('../utils/isEmail');
const encryptPassword = require('../utils/encryptPassword');
require('dotenv').config();

const router = express.Router();
const userService = new UserService(db);
const cartService = new CartService(db);

router.post('/login', async (req, res, next) => {
  const { emailOrUsername, password } = req.body;
  if (emailOrUsername == null || password == null) {
    return next(createHttpError(400, 'All fields are required'));
  }

  let userData;

  if (isEmail(emailOrUsername)) {
    // get user with email
    userData = await userService.getUserByEmail(emailOrUsername);
  } else {
    // get user with username
    userData = await userService.getUserByUsername(emailOrUsername);
  }

  if (!userData) {
    return next(createHttpError(401, 'Incorrect email/username or password'));
  }

  const hashedPassword = await encryptPassword(password, userData.salt);
  if (!crypto.timingSafeEqual(userData.encryptedPassword, hashedPassword)) {
    return next(createHttpError(401, 'Incorrect email/username or password'));
  }

  let token;
  try {
    token = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        RoleId: userData.RoleId,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '2h',
      }
    );
  } catch (err) {
    return next(createHttpError(500, 'Something went wrong with JWT token creation'));
  }
  res.cookie('token', token, {
    maxAge: 2 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true,
  });
  return res.jsend.success({ result: 'You are logged in', token: token });
});

router.post('/register', isValidEmail, async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    address,
    telephone,
    itemsPurchased,
    MembershipId,
    RoleId,
  } = req.body;
  if (
    firstName == null ||
    lastName == null ||
    username == null ||
    email == null ||
    password == null ||
    address == null ||
    telephone == null ||
    itemsPurchased == null ||
    MembershipId == null ||
    RoleId == null
  ) {
    return next(createHttpError(400, 'All fields are required'));
  }
  const r = await userService.addUser(
    firstName,
    lastName,
    username,
    email,
    password,
    address,
    telephone,
    itemsPurchased,
    MembershipId,
    RoleId
  );

  if (r.errors) {
    const errorMsg = r.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(409, r.errors[0].message));
  }

  return res.jsend.success({
    data: { statusCode: 200, result: 'User account created' },
  });
});

module.exports = router;
