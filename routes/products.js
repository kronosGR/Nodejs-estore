const express = require('express');

const ProductService = require('../services/ProductService');

const db = require('../models');
const isAdmin = require('../middleware/isAdmin');
const isValidUrl = require('../middleware/isValidUrl');
const isEmpty = require('../utils/isEmpty');
const createHttpError = require('http-errors');
const productService = new ProductService(db);
const router = express.Router();

router.get('/', async (req, res, next) => {
  let whereClause = req.query.whereclause;
  whereClause = whereClause.replace("'''", "%'");
  whereClause = whereClause.replace("''", "'%");
  const products = await productService.getProducts(whereClause);
  return res.jsend.success({ data: { statusCode: 200, result: products } });
});

router.post('/', isAdmin, isValidUrl, async (req, res, next) => {
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

module.exports = router;
