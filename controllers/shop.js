const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');
const stripe = require('stripe')('key');

const Product = require('../models/product');
// const Cart = require('../models/cart');
const Order = require('../models/order');



const ITEMS_PER_PAGE = 2;

exports.getProduct = (req, res, next) => {
    //console.log('In another Middleware!');
    // query is an object provided by express and page is name we set as parameter in view. + makes it an int
    const page = +req.query.page || 1; // || means if there isn't a value for page return value to 1 instead
    let totalItems;

    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find() // finds all data in products
                .skip((page - 1) * ITEMS_PER_PAGE) // skips querying items not needed for page
                .limit(ITEMS_PER_PAGE)  // puts a limit on number items on each page
        })
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Products',
                path: '/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // Sequelize code
    // Product.findAll()
    //     .then(products => {
    //         res.render('shop/product-list', {
    //             prods: products,
    //             pageTitle: 'All Products',
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    // });

    // non database code
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

    Product.findById(prodId)    // findById is not our method anymore, mongoose already has it
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

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

    // Sequelize code for finding single product
    // Product.findByPk(prodId)
    //     .then(product => {
    //         res.render('shop/product-detail', {
    //             product: product,
    //             pageTitle: product.title,
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => console.log(err));

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
    // Product.fetchAll(), MongoDB syntax without mongoose
    // query is an object provided by express and page is name we set as parameter in view. + makes it an int
    const page = +req.query.page || 1; // || means if there isn't a value for page return value to 1 instead
    let totalItems;

    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find() // finds all data in products
                .skip((page - 1) * ITEMS_PER_PAGE) // skips querying items not needed for page
                .limit(ITEMS_PER_PAGE)  // puts a limit on number items on each page
        })
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'shop',
                path: '/',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // Sequelize code
    // Product.findAll()
    //     .then(products => {
    //         res.render('shop/index', {
    //             prods: products,
    //             pageTitle: 'shop',
    //             path: '/'
    //             });
    //         })
    //     .catch(err => {
    //         console.log(err);
    //      });

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
        // .getCart()  // created with user.js model and not needed with mongoose
        .populate('cart.items.productId')   // populate is not a promise therefore needs execPopulate function
        .execPopulate()
        .then(user => {
            console.log(user.cart.items);
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Shopping Cart',
                products: products
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // Sequelize code
    // req.user
    //     .getCart()
    //     .then(cart => {
    //         return cart
    //             .getProducts()
    //             .then(products => {
    //                 res.render('shop/cart', {
    //                     path: '/cart',
    //                     pageTitle: 'Shopping Cart',
    //                     products: products
    //                 })
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //             });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

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
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product); // refers to the addToCart method in user model
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // Sequelize code for getting adding to cart with cart and cart-items model
    // const prodId = req.body.productId;
    // let fetchedCart;
    // let newQuantity = 1;
    // req.user
    //     .getCart()
    //     .then(cart => {
    //         fetchedCart = cart;
    //         return cart.getProducts({ where: { id: prodId } }); //getProducts() is sequel function using 'where' parameter to pull out the id
    //     })
    //     .then(products => {
    //         let product;
    //         if (products.length > 0) {
    //             product = products[0];
    //         }
    //         if (product) {
    //             const oldQuantity = product.cartItem.quantity;      // Reads from database using cartItem
    //             newQuantity = oldQuantity + 1;                      // Adds quantity to product if the product exists in cart
    //             return product;
    //         }
    //         return Product
    //             .findByPk(prodId)
    //     })
    //     .then(product => {
    //         return fetchedCart.addProduct(product, {                // Returns item quantity and adds it to view using 'quantity'
    //             through: { quantity: newQuantity }
    //         });
    //     })
    //     .then(() => {
    //         res.redirect('/cart');
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

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
        // MongoDB user method without mongoose
        // .deleteItemFromCart(prodId)
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // Sequelize MySQL code
    // const prodId = req.body.productId;
    // req.user
    //     .getCart()
    //     .then(cart => {
    //         return cart.getProducts({ where: { id: prodId } }); // fetches cart with respective products for user
    //     })
    //     .then(products => {
    //         const product = products[0];
    //         return product.cartItem.destroy();                      // Deletes product referencing cartItem from database
    //     })
    //     .then(result => {
    //         res.redirect('/cart');
    //     })
    //     .catch(err => console.log(err));

    // Pre-database code
    // const prodId = req.body.productId;
    // Product.findById(prodId, product => {
    //     Cart.deleteProduct(prodId, product.price);
    //     res.redirect('/cart');
    // });
};

exports.getCheckout = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            let total = 0;
            products.forEach(p => {
                total += p.quantity * p.productId.price;
            });
            res.render('shop/checkout', {
                path: '/checkout',
                pageTitle: 'Checkout',
                products: products,
                totalSum: total
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postOrder = (req, res, next) => {
    const token = req.body.stripeToken;
    let totalSum = 0;

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            user.cart.items.forEach(p => {
                totalSum += p.quantity * p.productId.price;
            });
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };  // mongoose gives you _doc which pulls out all the product data
            });
            const order = new Order({
                user: {
                    // name: req.user.name,
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });
        return order.save();
        })
        // MongoDB method created in user model
        // .addOrder()
        .then(result => {
            const charge = stripe.charges.create({
                amount: totalSum * 100,
                currency: 'usd',
                description: 'Demo order',
                source: token,
                metadata: { order_id: result._id.toString() }
            });
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // Sequelize code
    // let fetchedCart;
    // req.user
    //     .getCart()
    //     .then(cart => {
    //         fetchedCart = cart;
    //         return cart.getProducts();  // Will return all products by default
    //     })
    //     .then(products => {
    //         return req.user
    //             .createOrder()
    //             .then(order => {
    //                 return order.addProducts(products.map(product => {
    //                     product.orderItem = { quantity: product.cartItem.quantity }; // Returning the quantity of items in cart into orders page
    //                     return product;
    //                 }));
    //             })
    //             .catch(err => console.log(err));
    //         console.log(products);
    //     })
    //     .then(result => {
    //         return fetchedCart.setProducts(null);   // Cleans up cart
    //     })
    //     .then(result => {
    //         res.redirect('/orders')
    //     })
    //     .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id })
        // MongoDB method made in user model
        // req.user .getOrders()
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // Sequelize code for getting orders
    // req.user
    //     .getOrders({include: ['products'] })    // another magic method by sequel
    //     .then(orders => {
    //         res.render('shop/orders', {
    //             path: '/orders',
    //             pageTitle: 'Your Orders',
    //             orders: orders
    //         });
    //     })
    //     .catch(err => console.log(err));


};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found.'))
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'));
            }
            const invoiceName = 'Invoice-' + orderId + '.pdf';
            // first elem data, 2nd elem would be invoices folder and third would be the invoice file to be able to access it on multople OS due to path package
            const invoicePath = path.join('data', 'invoices', invoiceName);

            const pdfDoc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });

            pdfDoc.text('------------------------');
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price;
                pdfDoc.fontSize(14).text(
                    prod.product.title +
                    ' - ' +
                    prod.quantity +
                    ' x ' +
                    '$' +
                    prod.product.price
                );
            });
            pdfDoc.text('----------');
            pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

            pdfDoc.end();
            // storing file into memory. Not a common way to download data
            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) {
            //         return next(err);
            //     }
            //     res.setHeader('Content-Type', 'application/pdf');
            //     // inline setHeader allows it to be open in browser and attachment to download
            //     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            //     res.send(data);
            // });

            // Streaming data which is better for memory and better practice
            // const file = fs.createReadStream(invoicePath);
            // res.setHeader('Content-Type', 'application/pdf');
            // res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            // file.pipe(res);

        })
        .catch(err => next(err));
};

// exports.getCheckout = (req, res, next) => {
//     Product.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
// };