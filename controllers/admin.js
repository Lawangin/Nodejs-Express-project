const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // console.log('In the Middleware!');
    //res.sendFile(path.join(rootDir, 'Views', 'add-product.html'));
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        activeAddProduct: true
    });
};

exports.postAddProduct = (req, res, next) => {
    //products.push({title: req.body.title});
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, imageUrl, description, price);
    //product.save pushes the new product from html input to product array in models/product.js
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};