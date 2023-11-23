const express = require('express');
const createHttpError = require('http-errors');

const CategoryService = require('../services/CategoryService');
const isAdmin = require('../middleware/isAdmin');

const db = require('../models');
const isEmpty = require('../utils/isEmpty');
const categoryService = new CategoryService(db);
const router = express.Router();

router.get('/', async (req, res, next) => {
  const categories = await categoryService.getAllCategories();
  return res.jsend.success({ data: { statusCode: 200, result: categories } });
});

router.delete('/:categoryId', isAdmin, async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const res = await categoryService.deleteCategory(categoryId);
    if (res.name == 'SequelizeForeignKeyConstraintError') {
      return next(createHttpError(500, 'The category is being used'));
    }
  } catch (e) {
    return next(createHttpError(500, 'There was an error deleting the category'));
  }
  res.jsend.success({ statusCode: 200, result: 'Category deleted' });
});

router.post('/', async (req, res, next) => {
  const { name } = req.body;
  if (isEmpty(name)) {
    return next(createHttpError(400, 'Name is required'));
  }

  const ret = await categoryService.addCategory(name);
  if (ret.errors) {
    const errorMsg = ret.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 201, result: ret } });
});

router.put('/:categoryId', async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const { name } = req.body;
  if (isEmpty(name)) {
    return next(createHttpError(400, 'Name is required'));
  }

  const ret = await categoryService.updateCategory(categoryId, name);
  if (ret.errors) {
    const errorMsg = r.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 200, result: 'Category updated' } });
});

module.exports = router;
