//const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

//const rootDir = require('../helper/path');

const router = express.Router();


// /admin/add-product => GET
router.get('/Add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/Add-product', adminController.postAddProduct);

module.exports = router;