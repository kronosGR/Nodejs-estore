const express = require('express');
const createHttpError = require('http-errors');
const UserService = require('../services/UserService');
const isValidEmail = require('../middleware/isValidEmail');

const router = express.Router();

const db = require('../models');
const userService = new UserService(db);

router.post('/register', isValidEmail, async (req, res, next) => {
  const { firstName, lastName, username, email, password, address, telephone } = req.body;
  if (
    firstName == null ||
    lastName == null ||
    username == null ||
    email == null ||
    password == null ||
    address == null ||
    telephone == null
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
    1,
    2
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
