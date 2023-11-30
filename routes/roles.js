const express = require('express');

const RoleService = require('../services/RoleService');
const isAdmin = require('../middleware/isAdmin');

const db = require('../models');
const isEmpty = require('../utils/isEmpty');
const createHttpError = require('http-errors');
const roleService = new RoleService(db);
const router = express.Router();

router.get('/', async (req, res, next) => {
  // #swagger.tags = ['Roles']
  // #swagger.description = "Get All Roles"
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
                          "name": "Admin",
                          "createdAt": "2023-11-28T15:59:06.000Z",
                          "updatedAt": "2023-11-28T15:59:06.000Z"
                      },
                      {
                          "id": 2,
                          "name": "User",
                          "createdAt": "2023-11-28T15:59:06.000Z",
                          "updatedAt": "2023-11-28T15:59:06.000Z"
                      }
                  ]
              }
          }
        }
      }
  */
  const roles = await roleService.getRoles();
  return res.jsend.success({ data: { statusCode: 200, result: roles } });
});

router.delete('/:roleId', isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Roles']
  // #swagger.description = "Delete a Role"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['roleId']={
        in: 'path',
        description: 'Role Id',
        name : 'roleId',
        type: 'number',
        example: '1'
      } 
     #swagger.responses[200] = {
      description: 'Role deleted',
    }
     #swagger.responses[404] = {
      description: 'Not found',
    }
     #swagger.responses[500] = {
      description: 'The Role is being used',
    }

    */
  const roleId = req.params.roleId;
  try {
    const res = await roleService.deleteRole(roleId);
    if (res.name == 'SequelizeForeignKeyConstraintError') {
      return next(createHttpError(500, 'The brand is being used'));
    }
  } catch (e) {
    return next(createHttpError(500, 'There was an error deleting the role'));
  }
  res.jsend.success({ statusCode: 200, result: 'Role deleted' });
});

router.post('/', isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Roles']
  // #swagger.description = "Add a Role"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['body']={
      in: 'body',
       schema: {
                name: 'Super user',
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
                            "name": "Super user",
                            "updatedAt": "2023-11-30T07:37:23.428Z",
                            "createdAt": "2023-11-30T07:37:23.428Z"
                        }
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
  const { name } = req.body;
  if (isEmpty(name)) {
    return next(createHttpError(400, 'Name is required'));
  }

  const ret = await roleService.addRole(name);
  if (ret.errors) {
    const errorMsg = ret.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 201, result: ret } });
});

router.put('/:roleId', isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Roles']
  // #swagger.description = "Edit a Role"
  // #swagger.produces = ['text/json']
  /*  #swagger.parameters['roleId']={
      in: 'path',
      description: 'Role Id',
      name : 'roleId',
      type: 'number',
      example:1
     } 
     #swagger.parameters['body']={
      in: 'body',
       schema: {
                name: 'User',
            }
     } 
     #swagger.responses[200] = {
      schema:{
              "status": "success",
              "data": {
                "data": {
                    "statusCode": 200,
                    "result": "Role updated"
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
  const roleId = req.params.roleId;
  const { name } = req.body;
  if (isEmpty(name)) {
    return next(createHttpError(400, 'Name is required'));
  }

  const ret = await roleService.updateRole(roleId, name);
  if (ret.errors) {
    const errorMsg = r.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 200, result: 'Role updated' } });
});

module.exports = router;
