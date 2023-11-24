var express = require('express');

const db = require('../models');
const UserService = require('../services/UserService');

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
});

module.exports = router;
