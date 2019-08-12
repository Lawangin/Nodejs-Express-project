const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String,
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Referring to User Model. Sets up relation
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);

// MongoDB driver code
// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;
//
// class Product {
//     constructor(title, price, description, imageUrl, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ? new mongodb.ObjectId(id) : null; // if statement that returns null if id doesnt exist
//         this.userId = userId;
//     }
//
//     save () {
//         const db = getDb();
//         let dbOp;
//         if (this._id) {
//             //update the product
//             dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this });
//             //mongdb update one takes two argu, one filters which document we want to update, and other how to update
//             //$set is a mongodb syntax that updates whatever Object you put through. this refers to Product.constructor object
//         } else {
//             dbOp = db.collection('products').insertOne(this)
//         }
//         return dbOp
//             .then(result => {
//                 console.log(result);
//             })
//             .catch(err => console.log(err));
//     }
//
//     static fetchAll() {
//         const db = getDb();
//         return db
//             .collection('products')
//             .find() // find() can be used to with filters such as {title: 'green book'} in the parameter
//             .toArray()
//             .then(products => {
//                 console.log(products);
//                 return products;
//             })
//             .catch(err => console.log(err));
//     }
//
//     static findById(prodId) {
//         const db = getDb();
//         return db
//             .collection('products')
//             .find({_id: new mongodb.ObjectID (prodId) })
//             .next()
//             .then(product => {
//                 console.log(product);
//                 return product;
//             })
//             .catch(err => console.log(err));
//     }
//
//     static deleteById(prodId) {
//         const db = getDb();
//         return db.collection('products')
//             .deleteOne({_id: new mongodb.ObjectId(prodId)}) // mongodb syntax. Argu is a filter for which product. More can be found in mongodb documentation
//             .then(result => {
//                 console.log('deleted');
//             })
//             .catch(err => console.log(err));
//     }
// }
//
// module.exports = Product;


// const Sequelize = require('sequelize');
//
// const sequelize = require('../util/database');

// const Product = sequelize.define('product', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: Sequelize.STRING,
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     imageUrl: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });

// module.exports = Product;

//Model for product up to mySQL database

// const db = require('../util/database');
//
// //const products = [];
//
// // Only need this without a database, constructing files
// // const fs = require('fs');
// // const path = require('path');
//
// const Cart = require('./cart');
//
// // const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
//
// // Don't need a helper function with a database
// // const getProductsFromFile = (cb) => {
// //     fs.readFile(p, (err, fileContent) => {
// //         if (err) {
// //             return cb([]);
// //         }
// //         cb(JSON.parse(fileContent));
// //     });
// // };
//
// module.exports = class Product {
//     constructor(id, t, imageUrl, description, price) {
//         this.id = id;
//         this.title = t;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }
//
//     save() {
//         return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
//             [this.title, this.price, this.imageUrl, this.description]
//         );
//         //products.push(this);
//
//         // Code without Database
//         // getProductsFromFile(products => {
//         //     if (this.id) {
//         //         const existingProductIndex = products.findIndex(prod => prod.id === this.id);
//         //         const updatedProducts = [...products];
//         //         updatedProducts[existingProductIndex] = this;
//         //         fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//         //             console.log(err);
//         //         });
//         //     } else {
//         //         this.id = Math.random().toString();
//         //         products.push(this);
//         //         fs.writeFile(p, JSON.stringify(products), (err) => {
//         //             console.log(err);
//         //         });
//         //     }
//         // });
//     }
//
//     static deleteById(id) {
//
//         // Code without a database
//         // getProductsFromFile(products => {
//         //     const product = products.find(prod => prod.id === id);
//         //     const updatedProducts = products.filter(prod => prod.id !== id);
//         //     fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//         //         if (!err) {
//         //             Cart.deleteProduct(id, product.price);
//         //         }
//         //     })
//         // });
//     }
//
//     static fetchAll() {
//         return db.execute('SELECT * FROM products');
//         // Code without a database, cb parameter
//         // getProductsFromFile(cb);
//     }
//
//     static findById(id) {
//         return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
//         // Code without a database, id and cb parameter
//         // getProductsFromFile(products => {
//         //     const product = products.find(p => p.id === id);
//         //     cb(product);
//         // });
//     }
// };