const path = require('path');

const express = require('express');

const rootDir  = require('../helper/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    //console.log('In another Middleware!');
    // console.log('shop.js', adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));

    const products = adminData.products;
    res.render('shop', {
        prods: products,
        pageTitle: 'shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true
    });
});

module.exports = router;