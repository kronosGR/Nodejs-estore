const express = require('express');
const createHttpError = require('http-errors');

const CategoryService = require('../services/CategoryService');
const isAdmin = require('../middleware/isAdmin');

const db = require('../models');
const isEmpty = require('../utils/isEmpty');
const categoryService = new CategoryService(db);
const router = express.Router();

router.get('/', async (req, res, next) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = "Get All Brands"
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
                    "name": "Tablets",
                    "createdAt": "2023-11-28T15:59:06.000Z",
                    "updatedAt": "2023-11-28T15:59:06.000Z"
                }
            ]
        }
    }
  }
}
  */
  const categories = await categoryService.getAllCategories();
  return res.jsend.success({ data: { statusCode: 200, result: categories } });
});

router.delete('/:categoryId', isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = "Delete a category"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['categoryId']={
    schema:{
        in: 'path',
        description: 'Category Id',
        name : 'categoryId',
        type: 'number',
        example:1
      } 
    }
     #swagger.responses[200] = {
      description: 'Category deleted',
    }
     #swagger.responses[404] = {
      description: 'Not found',
    }
     #swagger.responses[500] = {
      description: 'The Category is being used',
    }

    */
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
  // #swagger.tags = ['Categories']
  // #swagger.description = "Add a Category"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['body']={
      in: 'body',
       schema: {
                name: 'Tablet',
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
                            "name": "test",
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

  const ret = await categoryService.addCategory(name);
  if (ret.errors) {
    const errorMsg = ret.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 201, result: ret } });
});

router.put('/:categoryId', async (req, res, next) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = "Edit a Category"
  // #swagger.produces = ['text/json']
  /*  #swagger.parameters['categoryId']={
      in: 'path',
      description: 'Category Id',
      name : 'categoryId',
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
                    "result": "Category updated"
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
  const categoryId = req.params.categoryId;
  const { name } = req.body;
  if (isEmpty(name)) {
    return next(createHttpError(400, 'Name is required'));
  }

  const ret = await categoryService.updateCategory(categoryId, name);
  if (ret.errors) {
    const errorMsg = ret.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 200, result: 'Category updated' } });
});

module.exports = router;
