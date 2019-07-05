const path = require('path');

const express = require('express');

const rootDir = require('../helper/path');

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/Add-product', (req, res, next) => {
    // console.log('In the Middleware!');
    //res.sendFile(path.join(rootDir, 'Views', 'add-product.html'));
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product', activeAddProduct: true });
});

// /admin/add-product => POST
router.post('/Add-product', (req, res, next) => {
    products.push({title: req.body.title});
    res.redirect('/');
});

exports.routes = router;
exports.products = products;