const express = require('express');
const createHttpError = require('http-errors');

const RoleService = require('../services/RoleService');
const UserService = require('../services/UserService');
const MembershipService = require('../services/Membership');

const router = express.Router();
const db = require('../models');
const roleService = new RoleService(db);
const userService = new UserService(db);
const membershipService = new MembershipService(db);

router.post('/', async function (req, res, next) {
  try {
    // Populate roles table
    await roleService.addRole('Admin');
    await roleService.addRole('User');

    // Populate memberships table
    await membershipService.addMembership('Bronze', 0, 14, 0);
    await membershipService.addMembership('Silver', 15, 29, 15);
    await membershipService.addMembership('Gold', 30, 999999999, 30);

    //add user
    await userService.addUser(
      'Admin',
      'Support',
      'Admin',
      'admin@noroff.no',
      'P@ssword2023',
      'Online',
      '911',
      '3',
      '1'
    );
  } catch (error) {
    return next(createHttpError(500, error));
  }
  return res.jsend.success({ statusCode: 201, result: 'Database Populated' });
});

module.exports = router;
