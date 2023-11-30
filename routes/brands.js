const express = require('express');
const createHttpError = require('http-errors');

const BrandService = require('../services/BrandService');
const isAdmin = require('../middleware/isAdmin');

const db = require('../models');
const brandService = new BrandService(db);
const router = express.Router();

router.get('/', async (req, res, next) => {
  // #swagger.tags = ['Brands']
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
                    "name": "Apple",
                    "createdAt": "2023-11-28T15:59:06.000Z",
                    "updatedAt": "2023-11-28T15:59:06.000Z"
                }
            ]
        }
    }
  }}



  */
  const brands = await brandService.getAllBrands();
  return res.jsend.success({ data: { statusCode: 200, result: brands } });
});

router.delete('/:brandId', isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Brands']
  // #swagger.description = "Delete a Brand"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['brandId']={
      in: 'path',
      description: 'Brand Id',
      name : 'brandId',
      type: 'number',
      example:1
     } 
     #swagger.responses[200] = {
      description: 'Brand deleted',
    }
     #swagger.responses[404] = {
      description: 'Not found',
    }
     #swagger.responses[500] = {
      description: 'The brand is being used',
    }
    */

  const brandId = req.params.brandId;
  try {
    const res = await brandService.deleteBrand(brandId);
    if (res.name == 'SequelizeForeignKeyConstraintError') {
      return next(createHttpError(500, 'The brand is being used'));
    }
  } catch (e) {
    return next(createHttpError(500, 'There was an error deleting the brand'));
  }
  res.jsend.success({ statusCode: 200, result: 'Brand deleted' });
});

router.post('/', isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Brands']
  // #swagger.description = "Add a Brand"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['body']={
      in: 'body',
       schema: {
                 "status": "success",
                "data": {
                    "data": {
                        "statusCode": 201,
                        "result": {
                            "id": 7,
                            "name": "Apple",
                            "updatedAt": "2023-11-30T07:37:23.428Z",
                            "createdAt": "2023-11-30T07:37:23.428Z"
                        }
                    }
                }
            }
     } 
     #swagger.responses[201] = {
      schema: {
                id:1,
                name: 'Apple',
            }
    }
     #swagger.responses[400] = {
      description: 'Name is required',
    }
     #swagger.responses[500] = {
    }
    */
  const { name } = req.body;
  if (name == null || name.length == 0)
    return next(createHttpError(400, 'Name is required'));

  const ret = await brandService.addBrand(name);
  if (ret.errors) {
    const errorMsg = ret.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 201, result: ret } });
});

router.put('/:brandId', isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Brands']
  // #swagger.description = "Edit a Brand"
  // #swagger.produces = ['text/json']
  /*  #swagger.parameters['brandId']={
      in: 'path',
      description: 'Brand Id',
      name : 'brandId',
      type: 'number',
      example:1
     } 
     #swagger.parameters['body']={
      in: 'body',
       schema: {
                $name: 'Apple',
            }
     } 
     #swagger.responses[200] = {
       schema:{
              "status": "success",
              "data": {
                "data": {
                    "statusCode": 200,
                    "result": "Brand updated"
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
  const brandId = req.params.brandId;
  const { name } = req.body;
  if (name == null || name.length == 0)
    return next(createHttpError(400, 'Name is required'));

  const ret = await brandService.updateBrand(brandId, name);
  if (ret.errors) {
    const errorMsg = r.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 200, result: 'Brand updated' } });
});

module.exports = router;
