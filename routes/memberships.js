const express = require('express');

const MembershipService = require('../services/MembershipService');
const db = require('../models');

const router = express.Router();
const membershipService = new MembershipService(db);

router.get('/', async (req, res, next) => {
  const memberships = await membershipService.getMemberships();
  return res.jsend.success({ data: { statusCode: 200, result: memberships } });
});

module.exports = router;
