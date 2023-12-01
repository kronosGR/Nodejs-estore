const express = require('express');
const request = require('supertest');

const URL = 'http://localhost:3000';

describe('Testing Routes', () => {
  let token;
  let categoryId;
  let productId;

  test('POST /auth/login Admin Login - with invalid user', async () => {
    let adminInfo = {
      emailOrUsername: 'Admin1',
      password: 'P@ssword20231',
    };
    const { body } = await request(URL).post('/auth/login').send(adminInfo);
    expect(body).toHaveProperty('data');
    expect(body.data).not.toHaveProperty('token');
    expect(body.data.statusCode).toBe(401);
  });

  test('POST /auth/login Admin Login - success', async () => {
    let adminInfo = {
      emailOrUsername: 'Admin',
      password: 'P@ssword2023',
    };
    const { body } = await request(URL).post('/auth/login').send(adminInfo);
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('token');
    token = body.data.token;
  });

  test('POST /categories - Add Category', async () => {
    const { body } = await request(URL)
      .post('/categories')
      .send({ name: 'TEST_CATEGORY1' })
      .set('Authorization', 'Bearer ' + token);
    expect(body).toHaveProperty('data');
    expect(body.data.data.statusCode).toBe(201);
    categoryId = body.data.data.result;
  });

  test('PUT /categories - Edit Category Name', async () => {
    const { body } = await request(URL)
      .put('/categories/' + categoryId)
      .send({ name: 'TEST_CATEGORY' })
      .set('Authorization', 'Bearer ' + token);
    expect(body.data.data.result).toBe('Category updated');
    expect(body).toHaveProperty('data');
  });

  test('POST /products Add Product', async () => {
    const { body } = await request(URL)
      .post('/products')
      .send({
        name: 'TEST_PRODUCT1',
        imgUrl: 'http://143.42.108.232/products/product-iphone.png',
        description: '3D Touch. 12MP photos. 4K video.',
        price: '549',
        quantity: '2',
        isDeleted: '0',
        brandId: '1',
        categoryId: categoryId,
      })
      .set('Authorization', 'Bearer ' + token);

    expect(body).toHaveProperty('data');
    expect(body.data.data.result).toBe('Product added');
    productId = body.data.data.id;
  });

  test('PUT /products Update Product', async () => {
    const { body } = await request(URL)
      .put('/products/' + productId)
      .send({
        name: 'TEST_PRODUCT',
        imgUrl: 'http://143.42.108.232/products/product-iphone.png',
        description: '3D Touch. 12MP photos. 4K video.',
        price: '549',
        quantity: 2,
        isDeleted: 0,
        BrandId: 1,
        CategoryId: categoryId,
      })
      .set('Authorization', 'Bearer ' + token);
    expect(body).toHaveProperty('data');
    expect(body.data.data.result).toBe('Product updated');
  });

  test('DELETE /products - Soft Delete Product', async () => {
    const { body } = await request(URL)
      .delete('/products/' + productId)
      .set('Authorization', 'Bearer ' + token);
    expect(body.data.result).toBe('Product deleted');
  });

  test('DELETE /categories - Delete Category - The category is being used', async () => {
    const { body } = await request(URL)
      .delete('/categories/' + categoryId)
      .set('Authorization', 'Bearer ' + token);
    expect(body.data.data).toBe('The category is being used');
  });

  test('GET /categories - Get all Categories', async () => {
    const { body } = await request(URL).get('/categories');
    console.log(body);
    expect(body).toHaveProperty('data');
    expect(body.data.data.result.length).toBeGreaterThan(0);
  });

  test('GET /products - Get all products', async () => {
    const { body } = await request(URL).get('/categories');
    console.log(body);
    expect(body).toHaveProperty('data');
    expect(body.data.data.result.length).toBeGreaterThan(0);
  });
});
