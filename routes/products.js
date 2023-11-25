const express = require('express');

const ProductService = require('../services/ProductService');

const db = require('../models');
const productService = new ProductService(db);
const router = express.Router();

router.get('/', async (req, res, next) => {});

module.exports = router;
