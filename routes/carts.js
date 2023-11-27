const express = require('express');

const db = require('../models');
const CartService = require('../services/CartService');

const cartService = new CartService(db);
