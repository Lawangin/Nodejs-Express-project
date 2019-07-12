//const path = require('path');

const express = require('express');

const productsController = require('../controllers/products');

//const rootDir = require('../helper/path');

const router = express.Router();


// /admin/add-product => GET
router.get('/Add-product', productsController.getAddProduct);

// /admin/add-product => POST
router.post('/Add-product', productsController.postAddProduct);

module.exports = router;