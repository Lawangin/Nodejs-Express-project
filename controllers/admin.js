const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
    // console.log('In the Middleware!');
    //res.sendFile(path.join(rootDir, 'Views', 'add-product.html'));
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // With Mongodb driver
    // replace product parameters, Product(title, price, description, imageUrl, null, req.user._id);
    // Mongoose Product below
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user    // gives access to userId which refers User model through Product model
    });
    product
        .save()
        .then(result => {
            console.log('created product');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

    // Sequel and MySQL code
    // products.push({title: req.body.title});
    // req.user.createProduct({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description,
    // })
    // .then(result => {
    //     //console.log(result);
    //     console.log('Created Product');
    //     res.redirect('/admin/products');
    // }).catch(err => {
    //     console.log(err);
    // });

    // MySQL version of creating a new product
    // const product = new Product(null, title, imageUrl, description, price);
    // //product.save pushes the new product from html input to product array in models/product.js, mysql
    // product.save()
    //     .then( () => {
    //         res.redirect('/');
    //     } )
    //     .catch(err => { console.log(err)} );

};

exports.getProducts =  (req, res, next) => {
    // Product.fetchAll() is MongoDB syntax
    Product.find()  // returns all products auto in mongoose
        // which fields should be retrieved from the database from the Product collection/schema.
        // Minus and parameter will exclude it such as, -_id
        // .select('title price -_id')

        // Gives you all the data of the first parameter in this case userId instead of just _id.
        // parameter is path in which you wanted to populate. Can have nested paths such as userId.user
        // .populate('userId', 'name')
        .then(products => {
            console.log(products);
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId =req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    // MongoDB code for new product,
    // const product = new Product(updatedTitle, updatedPrice,  updatedDescription, updatedImageUrl, prodId)
    Product.findById(prodId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl;
        return product.save();  // save() comes with mongoose
    })
        .then(result => {
            console.log('Updated Product');
            res.redirect('/admin/products');
        }) //because we added a return on .save(), this then() allows err to be catch on both promises
        .catch(err => {
            console.log(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    // Product.deleteById(prodId), Mongodb syntax
    Product.findByIdAndRemove(prodId)
        .then(() => {
            console.log('Destroyed Product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

// exports.getEditProduct = (req, res, next) => {
//     const editMode = req.query.edit;
//     if (!editMode) {
//         return res.redirect('/');
//     }
//     const prodId = req.params.productId;
//     req.user
//         .getProducts({ where: { id: prodId }})
//     // Product.findByPk(prodId)
//         .then(products => {
//             const product = products[0];
//             if (!product) {
//                 res.redirect('/');
//             }
//             res.render('admin/edit-product', {
//                 pageTitle: 'Edit Product',
//                 path: '/admin/edit-product',
//                 editing: editMode,
//                 product: product
//             });
//         })
//         .catch(err => {
//             console.log(err);
//         });
//
//     // MySQL code for getting the product to edit by finding the ID from sql database
//     // Product.findById(prodId, product => {
//     //     if (!product) {
//     //         res.redirect('/');
//     //     }
//     //     res.render('admin/edit-product', {
//     //         pageTitle: 'Edit Product',
//     //         path: '/admin/edit-product',
//     //         editing: editMode,
//     //         product: product
//     //     });
//     // });
//
// };
//
// exports.postEditProduct = (req, res, next) => {
//     const prodId =req.body.productId;
//     const updatedTitle = req.body.title;
//     const updatedPrice = req.body.price;
//     const updatedImageUrl = req.body.imageUrl;
//     const updatedDescription = req.body.description;
//     Product.findByPk(prodId)
//         .then(product => {
//             // This will not updated the SQL database unless we use the product.save()
//             product.title = updatedTitle;
//             product.price = updatedPrice;
//             product.description = updatedDescription;
//             product.imageUrl = updatedImageUrl;
//             return product.save(); //adding return prevents from nested promises, .then().catch(), like callbacks
//         })
//         .then(result => {
//             console.log('Updated Product');
//             res.redirect('/admin/products');
//         }) //because we added a return on .save(), this then() allows err to be catch on both promises
//         .catch(err => {
//             console.log(err);
//         });
//
//     // MySQL code getting new edited product after edits have been made by user
//     // const updatedProduct = new Product(
//     //     prodId,
//     //     updatedTitle,
//     //     updatedImageUrl,
//     //     updatedDescription,
//     //     updatedPrice
//     // );
//     // updatedProduct.save();
//     //res.redirect('/admin/products');
// };
//
// exports.getProducts = (req, res, next) => {
//     req.user
//         .getProducts()
//     // Product.findAll()
//         .then(products => {
//             res.render('admin/products', {
//                 prods: products,
//                 pageTitle: 'Admin Products',
//                 path: '/admin/products'
//             });
//         })
//         .catch(err => {
//             console.log(err);
//         });
//
//     // MySQL code for fetching all products on admin products page
//     // Product.fetchAll(products => {
//     //     res.render('admin/products', {
//     //         prods: products,
//     //         pageTitle: 'Admin Products',
//     //         path: '/admin/products'
//     //     });
//     // });
// };
//
// exports.postDeleteProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     // Product.destroy({}); One way to remove product with sequelize
//     Product.findByPk(prodId)
//         .then(product => {
//             return product.destroy();
//         })
//         .then(result => {
//             console.log('Destroyed Product');
//             res.redirect('/admin/products');
//         })
//         .catch(err => {
//             console.log(err);
//         });
//
//     // MySQL code for deleting product with method we created deleteById
//     // Product.deleteById(prodId);
//     // res.redirect('/admin/products');
// };