const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    // console.log('In the Middleware!');
    //res.sendFile(path.join(rootDir, 'Views', 'add-product.html'));
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        activeAddProduct: true
    });
};

exports.postAddProduct = (req, res, next) => {
    //products.push({title: req.body.title});
    const product = new Product(req.body.title);
    //product.save pushes the new product from html input to product array in models/product.js
    product.save();
    res.redirect('/');
};

exports.getProduct = (req, res, next) => {
    //console.log('In another Middleware!');
    // console.log('shop.js', adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));

    //const products = adminData.products;
    Product.fetchAll((products) => {
        res.render('shop', {
            prods: products,
            pageTitle: 'shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true
        });
    });

};