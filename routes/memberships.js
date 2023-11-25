const express = require('express');

const MembershipService = require('../services/MembershipService');
const db = require('../models');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();
const membershipService = new MembershipService(db);

router.get('/', async (req, res, next) => {
  const memberships = await membershipService.getMemberships();
  return res.jsend.success({ data: { statusCode: 200, result: memberships } });
});

router.delete('/:membershipId', isAdmin, async (req, res, next) => {
  const membershipId = req.params.membershipId;
  try {
    const res = membershipService.deleteMembership(membershipId);
    if (res.name == 'SequelizeForeignKeyConstraintError') {
      return next(createHttpError(500, 'The membership is being used'));
    }
  } catch (error) {
    return next(createHttpError(500, 'There was an error deleting the membership'));
  }
  res.jsend.success({ statusCode: 200, result: 'membership deleted' });
});
module.exports = router;
