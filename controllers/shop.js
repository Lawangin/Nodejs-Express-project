const Product = require('../models/product');
// const Cart = require('../models/cart');
// const Order = require('../models/order');



exports.getProduct = (req, res, next) => {
    //console.log('In another Middleware!');
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
    });

    // console.log('shop.js', adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));

    //const products = adminData.products;

    // MySQL fetch all products for the shop product list page
    // Product.fetchAll()
    //     .then(([rows, fieldData]) => {
    //         res.render('shop/product-list', {
    //             prods: rows,
    //             pageTitle: 'All Products',
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => console.log(err));
};

exports.getSingleProduct = (req, res, next) => {
    const prodId = req.params.productId;

    // Same as findByPk in sequelize but uses the where parameter in findAll
    // Product.findAll({where: {id: prodId}}).then(products => {   //where parameter that can grab specific attributes of product
    //     res.render('shop/product-detail', {
    //         product: products[0],                                                //because findAll returns array [0] must be used to find single product
    //         pageTitle: product[0].title,
    //         path: '/products'
    //     });
    // }).catch(err => {
    //     console.log(err);
    // });

    Product.findByPk(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));

    // MySQL code for getting a single product detail
    // Product.findById(prodId)
    //     .then(([product]) => {
    //         res.render('shop/product-detail', {
    //             product: product[0],
    //             pageTitle: product.title,
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'shop',
                path: '/'
                });
            })
        .catch(err => {
            console.log(err);
         });

    // MySQL code for fetching all for index page
    // Product.fetchAll()
    //     .then(([rows, fieldData]) => {
    //         res.render('shop/index', {
    //             prods: rows,
    //             pageTitle: 'shop',
    //             path: '/'
    //         });
    //     })
    //     .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            return cart
                .getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Shopping Cart',
                        products: products
                    })
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });

    // Code for JSON related cart
    // Cart.getCart(cart => {
    //     Product.fetchAll(products => {
    //         const cartProducts = [];
    //         for (product of products) {
    //             const cartProductData = cart.products.find(prod => prod.id === product.id);
    //             if (cartProductData) {
    //                 cartProducts.push({productData: product, qty: cartProductData.qty});
    //             }
    //         }
    //         res.render('shop/cart', {
    //             path: '/cart',
    //             pageTitle: 'Shopping Cart',
    //             products: cartProducts
    //         });
    //     });
    // });

};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } }); //getProducts() is sequel function using 'where' parameter to pull out the id
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;      // Reads from database using cartItem
                newQuantity = oldQuantity + 1;                      // Adds quantity to product if the product exists in cart
                return product;
            }
            return Product
                .findByPk(prodId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, {                // Returns item quantity and adds it to view using 'quantity'
                through: { quantity: newQuantity }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });

    // JSON related code, non database
    // const prodId = req.body.productId;
    // Product.findById(prodId, (product) => {
    //     Cart.addProduct(prodId, product.price);
    // });
    // res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } }); // fetches cart with respective products for user
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();                      // Deletes product referencing cartItem from database
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));

    // Pre-database code
    // const prodId = req.body.productId;
    // Product.findById(prodId, product => {
    //     Cart.deleteProduct(prodId, product.price);
    //     res.redirect('/cart');
    // });
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();  // Will return all products by default
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity }; // Returning the quantity of items in cart into orders page
                        return product;
                    }));
                })
                .catch(err => console.log(err));
            console.log(products);
        })
        .then(result => {
            return fetchedCart.setProducts(null);   // Cleans up cart
        })
        .then(result => {
            res.redirect('/orders')
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({include: ['products'] })    // another magic method by sequel
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));


};

// exports.getCheckout = (req, res, next) => {
//     Product.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
// };