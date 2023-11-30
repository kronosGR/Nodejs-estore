const express = require('express');

const ProductService = require('../services/ProductService');

const db = require('../models');
const isAdmin = require('../middleware/isAdmin');
const isValidUrl = require('../middleware/isValidUrl');
const isEmpty = require('../utils/isEmpty');
const createHttpError = require('http-errors');
const productService = new ProductService(db);
const router = express.Router();

router.get('/:productId', async (req, res, next) => {
  // #swagger.tags = ['Products']
  // #swagger.description = "Get a product"
  // #swagger.produces = ['text/json']
  /*  #swagger.parameters['productId']={
      schema:{
          in: 'path',
          description: 'Product Id',
          name : 'productId',
          type: 'number',
          example:1
        } 
      }
      #swagger.responses [200] = {
        schema:{
          "status": "success",
            "data": {
                "data": {
                    "statusCode": 200,
                    "result": {
                        "id": 2,
                        "name": "Apple TV 2016",
                        "imgUrl": "http://143.42.108.232/products/product-apple-tv.png",
                        "description": "The future of television is here.",
                        "price": 599,
                        "quantity": 5,
                        "isDeleted": false,
                        "createdAt": "2023-11-28T15:59:06.000Z",
                        "updatedAt": "2023-11-30T07:48:26.000Z",
                        "BrandId": 1,
                        "CategoryId": 2,
                        "Category": {
                            "id": 2,
                            "name": "TVs",
                            "createdAt": "2023-11-28T15:59:06.000Z",
                            "updatedAt": "2023-11-28T15:59:06.000Z"
                        },
                        "Brand": {
                            "id": 1,
                            "name": "Apple",
                            "createdAt": "2023-11-28T15:59:06.000Z",
                            "updatedAt": "2023-11-28T15:59:06.000Z"
                        }
                    }
                }
            }
        }
      }

  */
  const productId = req.params.productId;
  const product = await productService.getProduct(productId);
  return res.jsend.success({ data: { statusCode: 200, result: product } });
});

router.post('/get', async (req, res, next) => {
  // #swagger.tags = ['Products']
  // #swagger.description = "Get all or search products"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['body']={
        in: 'body',
        schema: {
                  searchOptions: {
                    category :"1"
                  },
              }
      } 
    #swagger.responses[200] = {
      schema: {
         "status": "success",
            "data": {
                "data": {
                    "statusCode": 200,
                    "result": [
                        {
                            "id": 7,
                            "name": "9.7-inch iPad Pro 32Gb",
                            "imgUrl": "http://143.42.108.232/products/product-ipad-pro.png",
                            "description": "3D Touch. 12MP photos. 4K video.",
                            "price": 99,
                            "quantity": 18,
                            "isDeleted": 0,
                            "createdAt": "2023-11-28T15:59:06.000Z",
                            "updatedAt": "2023-11-28T15:59:06.000Z",
                            "BrandId": 1,
                            "brandName": "Apple",
                            "CategoryId": 1,
                            "categoryName": "Tablets"
                        },
                        {
                            "id": 9,
                            "name": "iPad Air 2 32/64Gb",
                            "imgUrl": "http://143.42.108.232/products/product-ipad-air.png",
                            "description": "Light. Heavyweight",
                            "price": 399,
                            "quantity": 55,
                            "isDeleted": 0,
                            "createdAt": "2023-11-28T15:59:06.000Z",
                            "updatedAt": "2023-11-28T15:59:06.000Z",
                            "BrandId": 1,
                            "brandName": "Apple",
                            "CategoryId": 1,
                            "categoryName": "Tablets"
                        },
                        {
                            "id": 14,
                            "name": "Samsung Galaxy Tab A7 Lite (T220) 8.7-inch 16GB Wi-Fi Tablet",
                            "imgUrl": "http://143.42.108.232/products/product-samsung-tab-A7.png",
                            "description": "Android table - perfect for kids",
                            "price": 20,
                            "quantity": 8,
                            "isDeleted": 0,
                            "createdAt": "2023-11-28T15:59:06.000Z",
                            "updatedAt": "2023-11-28T15:59:06.000Z",
                            "BrandId": 2,
                            "brandName": "Samsung",
                            "CategoryId": 1,
                            "categoryName": "Tablets"
                        }
                    ]
                }
            } 
      }
    }
  */
  let { searchOptions } = req.body;
  console.log(searchOptions);
  let whereClause = 'where ';
  let searchLen = Object.keys(searchOptions).length;
  if (searchLen == 0) {
    whereClause = '';
  } else {
    let i = 0;
    for (const [k, v] of Object.entries(searchOptions)) {
      switch (k) {
        case 'name':
          whereClause += "products.name like '%" + v + "%' ";
          break;
        case 'category':
          whereClause += "CategoryId = '" + v + "' ";
          break;
        case 'brand':
          whereClause += "BrandId = '" + v + "' ";
          break;
        default:
          break;
      }

      if (i < searchLen - 1) {
        whereClause += ' and ';
      }
      i++;
    }
  }

  const products = await productService.getProducts(whereClause);
  return res.jsend.success({ data: { statusCode: 200, result: products } });
});

router.post('/', isAdmin, isValidUrl, async (req, res, next) => {
  // #swagger.tags = ['Products']
  // #swagger.description = "Add a Product"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['body']={
       in: 'body',
       schema: {
                  name:"iPhone",
                  imgUrl:"http://143.42.108.232/products/product-iphone.png",
                  description:"3D Touch. 12MP photos. 4K video.",
                  price:"549",
                  quantity:"2",
                  isDeleted:"0",
                  brandId:"1",
                  categoryId:"2" ,
                }
            } 
    #swagger.responses [200] = {
        schema:{
        "status": "success",
        "data": {
            "data": {
                "statusCode": 201,
                "result":"Product added"
            }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'All fields required',
    }
     #swagger.responses[500] = {
    }
     */
  const { name, description, quantity, price, imgUrl, isDeleted, categoryId, brandId } =
    req.body;

  if (
    isEmpty(name) ||
    isEmpty(description) ||
    isEmpty(quantity) ||
    isEmpty(price) ||
    isEmpty(imgUrl) ||
    isEmpty(isDeleted) ||
    isEmpty(categoryId) ||
    isEmpty(brandId)
  ) {
    return next(createHttpError(400, 'All fields are required'));
  }

  const ret = await productService.addProduct(
    name,
    imgUrl,
    description,
    price,
    quantity,
    isDeleted,
    brandId,
    categoryId
  );
  if (ret.errors) {
    const errorMsg = ret.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 200, result: 'Product added' } });
});

router.delete('/:productId', isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Products']
  // #swagger.description = "Update a Product"
  // #swagger.produces = ['text/json']
  /* #swagger.parameters['productId']={
    schema:{
        in: 'path',
        description: 'Product Id',
        name : 'productId',
        type: 'number',
        example:1
      } 
    }
    
     #swagger.responses[200] = {
      description: 'Product deleted',
    }
     #swagger.responses[404] = {
      description: 'Not found',
    }
     #swagger.responses[500] = {
      description: 'The Product is being used',
    }

    */
  const productId = req.params.productId;
  try {
    const res = await productService.deleteProduct(productId);
    if (res.name == 'SequelizeForeignKeyConstraintError') {
      return next(createHttpError(500, 'The product is being used'));
    }
  } catch (error) {
    return next(createHttpError(500, 'There was an error deleting the product'));
  }
  res.jsend.success({ statusCode: 200, result: 'Product deleted' });
});

router.put('/:productId', isAdmin, isValidUrl, async (req, res, next) => {
  // #swagger.tags = ['Products']
  // #swagger.description = "Edit a Product"
  // #swagger.produces = ['text/json']
  /*  #swagger.parameters['productId']={
      in: 'path',
      description: 'Product Id',
      name : 'productId',
      type: 'number',
      example:1
     } 
    #swagger.parameters['body']={
       in: 'body',
       schema: {
                  name:"iPhone",
                  imgUrl:"http://143.42.108.232/products/product-iphone.png",
                  description:"3D Touch. 12MP photos. 4K video.",
                  price:"549",
                  quantity:"2",
                  isDeleted:"0",
                  brandId:"1",
                  categoryId:"2" ,
                }
            } 
     #swagger.responses[200] = {
      schema:{
              "status": "success",
              "data": {
                "data": {
                    "statusCode": 200,
                    "result": "Product updated"
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
  const productId = req.params.productId;
  const { name, imgUrl, description, price, quantity, isDeleted, BrandId, CategoryId } =
    req.body;

  if (
    isEmpty(name) ||
    isEmpty(description) ||
    isEmpty(quantity) ||
    isEmpty(price) ||
    isEmpty(imgUrl) ||
    isEmpty(isDeleted) ||
    isEmpty(CategoryId) ||
    isEmpty(BrandId)
  ) {
    return next(createHttpError(400, 'All fields are required'));
  }

  const ret = await productService.updateProduct(
    productId,
    name,
    imgUrl,
    description,
    price,
    quantity,
    isDeleted,
    BrandId,
    CategoryId
  );

  if (ret.errors) {
    const errorMsg = ret.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 200, result: 'Product updated' } });
});

module.exports = router;
