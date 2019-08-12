const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{   // can set up an array with type String in there or we can do documents as used by the code
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }]
    }
});

userSchema.methods.addToCart = function(product) {  // instance method
    const cartProductIndex = this.cart.items.findIndex(cp => {  // userSchema has cart and item object up above
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updateCartItems = [...this.cart.items];   // control quantity and updated the cart


        if (cartProductIndex >= 0) { // Checks whether we have the product in the cart
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;   // if we do calculate new quantity based on old quantity
            updateCartItems[cartProductIndex].quantity = newQuantity;   // update the Array
        } else {
            updateCartItems.push({ productId: product._id, quantity: newQuantity }); // or update an array by pushed new object
        }

        const updatedCart = { items: updateCartItems }; // the updated cart
        this.cart = updatedCart;
        return this.save();
};

// getCart is functional with populate function in shop controller

userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {   // filter out the items that should survive.
            return item.productId.toString() !== productId.toString();
        });
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
};

module.exports = mongoose.model('User', userSchema);

// MongoDB driver code
// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;
//
// const ObjectId = mongodb.ObjectId;
//
// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart; // {items: []}
//         this._id = id;
//     }
//
//     save () {
//         const db = getDb();
//
//         return db.collection('users')
//             .insertOne(this);
//     }
//
//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;
//         const updateCartItems = [...this.cart.items];
//
//
//         if (cartProductIndex >= 0) { // Anything but negative
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updateCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updateCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
//         }
//
//         const updatedCart = { items: updateCartItems };
//         const db = getDb();
//         return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart }});
//     }
//
//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         });
//         // object inside find() is mongodb query. Look into it with mongodb documentation
//         // $in requires an array such as products Ids from items in the cart
//         return db.collection('products')
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then(products => {
//                 // returns us an array with all the products in cart
//                 return products.map(p => {
//                     return { ...p, quantity: this.cart.items.find(i => {
//                         return i.productId.toString() === p._id.toString();
//                         }).quantity
//                     };
//                 });
//             });
//     }
//
//     deleteItemFromCart(productId) {
//         // [...this.cart.items] copies existing cart items
//         const updatedCartItems = this.cart.items.filter(item => {   // filter out the items that should survive. return true if I want to keep, return false if I want get rid of it
//             return item.productId.toString() !== productId.toString();                    // returns false
//         });
//         const updatedCart = { items: updatedCartItems };
//         const db = getDb();
//         return db
//             .collection('users')
//             .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: { items: updatedCartItems } } }
//             );
//     }
//
//     addOrder() {
//         const db = getDb();
//         return this.getCart()                    //grabbed the products in our cart
//             .then(products => {
//             const order = {                      // created an order object with id and user info
//                 items: products,
//                 user: {
//                     _id: new ObjectId(this._id),
//                     name: this.name,
//                     email: this.email
//                 }
//             };
//             return db.collection('orders').insertOne(order);     //inserted into a new collection
//             })
//             .then(result => {
//             this.cart = {items: []};
//             return db
//                 .collection('users')
//                 .updateOne(
//                     { _id: new ObjectId(this._id) },
//                     { $set: { cart: { items: [] } } }
//                 );
//         });
//     }
//
//     getOrders() {
//         const db = getDb();
//         return db
//             .collection('orders')
//             .find({ 'user._id': new ObjectId(this._id) })
//             .toArray();
//     }
//
//     static findById(userId) {
//         const db = getDb();
//
//         return db.collection('users')
//             .findOne({ _id: new ObjectId(userId)})
//             .then(user => {
//                 console.log(user);
//                 return user;
//             })
//             .catch(err => console.log(err));    // if using find(), then you must put next()
//     }
// }
//
// module.exports = User;

// Sequelize code for defining a user
// const Sequelize = require('sequelize');
//
// const sequelize = require('../util/database');
//
// const User = sequelize.define('user', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: Sequelize.STRING,
//     email: Sequelize.STRING
// });
//
// module.exports = User;