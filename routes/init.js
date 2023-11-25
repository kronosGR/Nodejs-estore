const express = require('express');
const createHttpError = require('http-errors');
require('dotenv').config();

const RoleService = require('../services/RoleService');
const UserService = require('../services/UserService');
const MembershipService = require('../services/MembershipService');
const BrandService = require('../services/BrandService');
const CategoryService = require('../services/CategoryService');
const ProductService = require('../services/ProductService');
const OrderStatusService = require('../services/OrderStatusService');

const router = express.Router();
const db = require('../models');
const fetchInitialProducts = require('../utils/fetchInitialProducts');
const roleService = new RoleService(db);
const userService = new UserService(db);
const membershipService = new MembershipService(db);
const brandService = new BrandService(db);
const categoryService = new CategoryService(db);
const productService = new ProductService(db);
const orderStatusService = new OrderStatusService(db);
router.post('/', async function (req, res, next) {
  try {
    // Populate roles table
    await roleService.addRole('Admin');
    await roleService.addRole('User');

    // Populate memberships table
    await membershipService.addMembership('Bronze', 0, 14, 0);
    await membershipService.addMembership('Silver', 15, 29, 15);
    await membershipService.addMembership('Gold', 30, 999999999, 30);

    //add user
    await userService.addUser(
      'Admin',
      'Support',
      'Admin',
      'admin@noroff.no',
      'P@ssword2023',
      'Online',
      '0',
      '911',
      '3',
      '1'
    );

    //add orderStatuses
    await orderStatusService.addOrderStatus('In Progress');
    await orderStatusService.addOrderStatus('Ordered');
    await orderStatusService.addOrderStatus('Completed');

    //add Brands
    await brandService.addBrand('Apple');
    await brandService.addBrand('Samsung');
    await brandService.addBrand('Xiaomi');
    await brandService.addBrand('MXQ');

    //add Categories
    await categoryService.addCategory('Tablets');
    await categoryService.addCategory('TVs');
    await categoryService.addCategory('Phones');
    await categoryService.addCategory('Desktops');
    await categoryService.addCategory('Laptops');
    await categoryService.addCategory('Watches');

    //add initial products
    const products = await fetchInitialProducts(process.env.INIT_URL); //console.log(products.data);
    products.data.forEach(async (item) => {
      const catId = (await categoryService.getCategoryIdByName(item.category))[0].id;
      const brandId = (await brandService.getBrandIdByName(item.brand))[0].id;
      await productService.addProduct(
        item.name,
        item.imgurl,
        item.description,
        item.price,
        item.quantity,
        false,
        brandId,
        catId
      );
    });
  } catch (error) {
    return next(createHttpError(500, error));
  }
  return res.jsend.success({ statusCode: 201, result: 'Database Populated' });
});

module.exports = router;
