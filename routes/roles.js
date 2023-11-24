const express = require('express');

const RoleService = require('../services/RoleService');
const isAdmin = require('../middleware/isAdmin');

const db = require('../models');
const isEmpty = require('../utils/isEmpty');
const createHttpError = require('http-errors');
const roleService = new RoleService(db);
const router = express.Router();

router.get('/', async (req, res, next) => {
  const roles = await roleService.getRoles();
  return res.jsend.success({ data: { statusCode: 200, result: roles } });
});

router.delete('/:roleId', isAdmin, async (req, res, next) => {
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
