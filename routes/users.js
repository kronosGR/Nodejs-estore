var express = require('express');

const db = require('../models');
const UserService = require('../services/UserService');
const CartService = require('../services/CartService');
const isEmpty = require('../utils/isEmpty');
const createHttpError = require('http-errors');
const isValidEmail = require('../middleware/isValidEmail');
const isAdmin = require('../middleware/isAdmin');

const userService = new UserService(db);
const cartService = new CartService(db);
const router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res, next) {
  // #swagger.tags = ['Users']
  // #swagger.description = "Get All Users"
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
                    "firstName": "Admin",
                    "lastName": "Support",
                    "username": "Admin",
                    "email": "admin@noroff.no",
                    "encryptedPassword": {
                        "type": "Buffer",
                        "data": [ 14, 229, 62,0, 243]
                    },
                     "salt": {
                        "type": "Buffer",
                        "data": [240, 116 ]
                    },
                    "address": "Online",
                    "telephone": "911",
                    "itemsPurchased": 0,
                    "createdAt": "2023-11-28T15:59:06.000Z",
                    "updatedAt": "2023-11-28T15:59:06.000Z",
                    "MembershipId": 3,
                    "RoleId": 1,
                    "Role": {
                        "id": 1,
                        "name": "Admin",
                        "createdAt": "2023-11-28T15:59:06.000Z",
                        "updatedAt": "2023-11-28T15:59:06.000Z"
                    },
                    "Membership": {
                        "id": 3,
                        "name": "Gold",
                        "from": 30,
                        "to": 999999999,
                        "discount": 30,
                        "createdAt": "2023-11-28T15:59:06.000Z",
                        "updatedAt": "2023-11-28T15:59:06.000Z"
                    }
                },
            ]
        }
    }
  }
}
  */
  const users = await userService.getUsers();
  return res.jsend.success({ data: { statusCode: 200, result: users } });
});

router.put('/:userId', async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.description = "Edit a User"
  // #swagger.produces = ['text/json']
  /*  #swagger.parameters['userId']={
        in: 'path',
        description: 'User Id',
        name : 'userId',
        type: 'number',
        example:1
     } 
    #swagger.parameters['body']={
      in: 'body',
       schema: {
                username : "kronos",
                email : "geo.elgeo@gmail.com",
                firstName : "Kronos",
                lastName : "Olympians",
                itemsPurchased : "0",
                address : "Olympus",
                telephone : "999",
                MembershipId : "3",
                RoleId : "1",
            }
     } 
      #swagger.responses[200] = {
      schema:{
              "status": "success",
              "data": {
                "data": {
                    "statusCode": 200,
                    "result": "User updated"
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
    const errorMsg = ret.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 200, result: 'User updated' } });
});

router.post('/', isValidEmail, async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.description = "Add a User"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['body']={
      in: 'body',
       schema: {
                username : "kronos",
                email : "geo.elgeo@gmail.com",
                firstName : "Kronos",
                lastName : "Olympians",
                itemsPurchased : "0",
                address : "Olympus",
                telephone : "999",
                MembershipId : "3",
                RoleId : "1",
            }
     } 
      #swagger.responses[200] = {
      schema:{
              "status": "success",
              "data": {
                "data": {
                    "statusCode": 200,
                    "result": "User Added"
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
  const {
    username,
    email,
    password,
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
    isEmpty(RoleId) ||
    isEmpty(password)
  ) {
    return next(createHttpError(400, 'All fields are required'));
  }

  const ret = await userService.addUser(
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

  if (ret.errors) {
    const errorMsg = ret.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }

  return res.jsend.success({ data: { statusCode: 200, result: 'User added' } });
});

router.delete('/:userId', isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.description = "Delete a User"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['userId']={
        in: 'path',
        description: 'User Id',
        name : 'userId',
        type: 'number',
        example:1
      } 
     #swagger.responses[200] = {
      description: 'User deleted',
    }
     #swagger.responses[404] = {
      description: 'Not found',
    }
     #swagger.responses[500] = {
      description: 'The User is being used',
    }

    */
  const userId = req.params.userId;
  try {
    const res = await userService.deleteUser(userId);
    if (res.name == 'SequelizeForeignKeyConstraintError') {
      return next(createHttpError(500, 'The user is being used'));
    }
  } catch (e) {
    return next(createHttpError(500, 'There was an error deleting the user'));
  }
  res.jsend.success({ statusCode: 200, result: 'User deleted' });
});

module.exports = router;
