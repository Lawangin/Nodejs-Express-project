//const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');   // imports check function from check subfolder in express-validator package

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

//const rootDir = require('../util/path');

const router = express.Router();


// /admin/add-product => GET
router.get('/Add-product', isAuth, adminController.getAddProduct);

// // /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',
    [
        body('title')
            .isLength({min: 4})
            .isString(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({min: 10, max: 400})
            .trim()
    ],
    isAuth,
    adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',
    [
        body('title')
            .isLength({min: 4})
            .isString(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({min: 10, max: 400})
            .trim()
    ],
    isAuth,
    adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;