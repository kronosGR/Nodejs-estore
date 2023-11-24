var express = require('express');

const db = require('../models');
const UserService = require('../services/UserService');
const isEmpty = require('../utils/isEmpty');
const createHttpError = require('http-errors');

const userService = new UserService(db);
var router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const users = await userService.getUsers();
  return res.jsend.success({ data: { statusCode: 200, result: users } });
});

router.put('/:userId', async (req, res, next) => {
  const userId = req.params.userId;
  const {
    username,
    email,
    firstName,
    lastName,
    itemsPurchased,
    address,
    telephone,
    MembershipId,
    RoleId,
  } = req.body;

  if (
    isEmpty(username) ||
    isEmpty(email) ||
    isEmpty(firstName) ||
    isEmpty(lastName) ||
    isEmpty(itemsPurchased) ||
    isEmpty(address) ||
    isEmpty(telephone) ||
    isEmpty(MembershipId) ||
    isEmpty(RoleId)
  ) {
    return next(createHttpError(400, 'All fields are required'));
  }
  const ret = await userService.updateUser(
    userId,
    firstName,
    lastName,
    username,
    email,
    address,
    telephone,
    itemsPurchased,
    MembershipId,
    RoleId
  );

  if (ret.errors) {
    const errorMsg = r.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 200, result: 'User updated' } });
});

router.post('/', async (req, res, next) => {
  const {
    username,
    email,
    firstName,
    lastName,
    itemsPurchased,
    address,
    telephone,
    MembershipId,
    RoleId,
  } = req.body;

  if (
    isEmpty(username) ||
    isEmpty(email) ||
    isEmpty(firstName) ||
    isEmpty(lastName) ||
    isEmpty(itemsPurchased) ||
    isEmpty(address) ||
    isEmpty(telephone) ||
    isEmpty(MembershipId) ||
    isEmpty(RoleId)
  ) {
    return next(createHttpError(400, 'All fields are required'));
  }

  const ret = await userService.addUser(
    firstName,
    lastName,
    username,
    email,
    address,
    telephone,
    itemsPurchased,
    MembershipId,
    RoleId
  );

  if (ret.errors) {
    const errorMsg = r.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 200, result: 'User added' } });
});

module.exports = router;
