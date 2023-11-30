const express = require('express');

const MembershipService = require('../services/MembershipService');
const db = require('../models');
const isAdmin = require('../middleware/isAdmin');
const isEmpty = require('../utils/isEmpty');
const createHttpError = require('http-errors');

const router = express.Router();
const membershipService = new MembershipService(db);

router.get('/', async (req, res, next) => {
  // #swagger.tags = ['Memberships']
  // #swagger.description = "Get All Memberships"
  // #swagger.produces = ['text/json']
  /* #swagger.responses [200] = {
    schema:{
     "status": "success",
     "data": {
        "data": {
            "statusCode": 200,
            "result": [
                {
                    "id": 1,
                    "name": "Bronze",
                    "createdAt": "2023-11-28T15:59:06.000Z",
                    "updatedAt": "2023-11-28T15:59:06.000Z"
                }
                    ]
                }
            }
          }
      }
  */
  const memberships = await membershipService.getMemberships();
  return res.jsend.success({ data: { statusCode: 200, result: memberships } });
});

router.delete('/:membershipId', isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Memberships']
  // #swagger.description = "Delete a Membership"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['membershipId']={
    schema:{
        in: 'path',
        description: 'Membership Id',
        name : 'membershipId',
        type: 'number',
        example:1
      } 
    }
     #swagger.responses[200] = {
      description: 'Membership deleted',
    }
     #swagger.responses[404] = {
      description: 'Not found',
    }
     #swagger.responses[500] = {
      description: 'The Membership is being used',
    }

    */
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

router.post('/', isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Memberships']
  // #swagger.description = "Add a Membership"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['body']={
      in: 'body',
       schema: {
                name: 'Bronze',
            }
     } 
     #swagger.responses[201] = {
      schema: {
                "status": "success",
                "data": {
                    "data": {
                        "statusCode": 201,
                        "result": {
                            "id": 7,
                            "name": "Bronze",
                            "updatedAt": "2023-11-30T07:37:23.428Z",
                            "createdAt": "2023-11-30T07:37:23.428Z"
                        }
                    }
                }
            }
    }
     #swagger.responses[400] = {
      description: 'All fields are required',
    }
     #swagger.responses[500] = {
    }
    */
  const { name, from, to, discount } = req.body;
  if (isEmpty(name) || isEmpty(from) || isEmpty(to) || isEmpty(discount)) {
    return next(createHttpError(400, 'All fields are required'));
  }

  const ret = await membershipService.addMembership(name, from, to, discount);
  if (ret.errors) {
    const errorMsg = ret.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 201, result: ret } });
});

router.put('/:membershipId', async (req, res, next) => {
  // #swagger.tags = ['Memberships']
  // #swagger.description = "Edit a Membership"
  // #swagger.produces = ['text/json']
  /*  #swagger.parameters['membershipId']={
      in: 'path',
      description: 'Membership Id',
      name : 'membershipId',
      type: 'number',
      example:1
     } 
     #swagger.parameters['body']={
      in: 'body',
       schema: {
                name: 'test1',
            }
     } 
     #swagger.responses[200] = {
      schema:{
              "status": "success",
              "data": {
                "data": {
                    "statusCode": 200,
                    "result": "Membership updated"
                }
          }
      }
    }
     #swagger.responses[400] = {
      description: 'Name is required',
    }
     #swagger.responses[500] = {
    }
    */
  const membershipId = req.params.membershipId;
  const { name, from, to, discount } = req.body;
  if (isEmpty(name) || isEmpty(from) || isEmpty(to) || isEmpty(discount)) {
    return next(createHttpError(400, 'All fields are required'));
  }

  const ret = await membershipService.updateMembership(
    membershipId,
    name,
    from,
    to,
    discount
  );
  if (ret.errors) {
    const errorMsg = ret.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 200, result: 'Membership updated' } });
});

module.exports = router;
