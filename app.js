//const http = require('http');
//not needed because of app.listen()
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//import handlebars module as its not part of express package
//const expressHbs = require('express-handlebars');

const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

// Sequelize and MySQL code
// const sequelize = require('./util/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

//handlerbars template engine
// app.engine('hbs', expressHbs({
//     layoutsDir: 'views/layouts',
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
// }));
// app.set('view engine', 'hbs');
// app.set('views', 'views');

//initializing pug template engine
//app.set('view engine', 'pug');
//app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Test Code with MySQL database
// db.execute('SELECT * FROM products')
//     .then(result => {
//         console.log(result[0], result[1]);
//     })
//     .catch(err => {
//         console.log(err);
//     });

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5d4e3321d2ad7b3367d4e767')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });

    // Sequelize code to register one user.
    // npm start runs sequelize not this middleware. Only registered for inc requests, therefore guaranteed to find a user
    // Sequelize and MySQL code
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
    // next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://Lawangin:@cluster0-ssqlj.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Lawangin',
                    email: 'Law@test.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(3000);
    })
    .catch(err => console.log(err));

// MongoDB connection
// mongoConnect(() => {
//     app.listen(3000);
// });

// Sequelize and MySQL code
// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }); // Product has one-to-many relationship with User where products delete if user is deleted
// User.hasMany(Product); // User may have many products hence one user to many products relationship. Inverse, do not need
//
// User.hasOne(Cart);
// Cart.belongsTo(User); // Inverse of above. Do not need
//
// Cart.belongsToMany(Product, { through: CartItem }); // Many-to-Many relationship
// Product.belongsToMany(Cart, { through: CartItem });
//
// Order.belongsTo(User);  // One-to-Many relationship
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem }); // Many-to-Many relationship
//
// sequelize
//     // .sync({ force: true })
//     .sync()
//     .then(result => {
//         User.findByPk(1);
//         // console.log(result);
//     })
//     .then(user => {
//         if (!user) {
//             return User.create({ name: 'Lawangin', email: 'test@test@gmail.com' }); // returns dummy user for testing
//         }
//         return user; // same as Promise.resolve(user);
//     })
//     .then(user => {
//         console.log(user);
//         return user.createCart();
//     })
//     .then(user => {
//         app.listen(3000);
//     })
//     .catch(err => {
//         console.log(err);
//     });
//
// //const server = http.createServer(app);
// //server.listen(3000);
// //same as below
// //app.listen(3000);