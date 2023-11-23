const express = require('express');
const db = require('../models');
const BrandService = require('../services/BrandService');
const isAdmin = require('../middleware/isAdmin');
const createHttpError = require('http-errors');

const brandService = new BrandService(db);
const router = express.Router();

router.get('/', async (req, res, next) => {
  const brands = await brandService.getAllBrands();
  return res.jsend.success({ data: { statusCode: 200, result: brands } });
});

router.delete('/:brandId', isAdmin, async (req, res, next) => {
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
  const { name } = req.body;
  if (name == null) return next(createHttpError(400, 'Name is required'));

  const ret = await brandService.addBrand(name);
  if (ret.errors) {
    const errorMsg = r.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 201, result: ret } });
});

router.put('/:brandId', isAdmin, async (req, res, next) => {
  const brandId = req.params.brandId;
  const { name } = req.body;
  if (name == null) return next(createHttpError(400, 'Name is required'));

  const ret = await brandService.updateBrand(brandId, name);
  if (ret.errors) {
    const errorMsg = r.errors[0].message;
    console.error(errorMsg);
    return next(createHttpError(500, errorMsg));
  }
  return res.jsend.success({ data: { statusCode: 200, result: 'Brand updated' } });
});

module.exports = router;
