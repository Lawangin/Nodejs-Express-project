const path = require('path');

const express = require('express');

//const rootDir  = require('../helper/path');
//const adminData = require('./admin');

const productsController = require('../controllers/products');

const router = express.Router();

router.get('/', productsController.getProduct);

module.exports = router;