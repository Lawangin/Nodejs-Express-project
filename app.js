//const http = require('http');
//not needed because of app.listen()
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
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


// ?retryWrites=true&w=majority removed from URI for it to work with sessions
const MONGODB_URI = 'insert your URI CODE';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
    // can also add expiration
});
// CSRF token protection initialization with default function as it relates to sessions
// creates a token for any POST requests
const csrfProtection = csrf();

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
const authRoutes = require('./routes/auth');


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

// session middleware. Written to database. the session will not saved on every response because of resave: false
// sessions are more secure and don't have cookie limitations
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

// middleware to use csrf token
app.use(csrfProtection);

app.use(flash());   // we can use this middle function flash anywhere in our application on req object

app.use((req, res, next) => {
    // locals is a express field that allows locals variables that will be passed to the views
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
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
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);
// special error handling middleware provided by express that allows it run first if called upon in rest of code instead of top to bottom
app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode.render(...)
    // res.redirect('/500');
    res.status(500).render('500', {
        pageTitle: 'Server Error',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
});

mongoose.connect(MONGODB_URI)
    .then(result => {
        // User.findOne().then(user => {
        //     if (!user) {
        //         const user = new User({
        //             name: 'Lawangin',
        //             email: 'Law@test.com',
        //             cart: {
        //                 items: []
        //             }
        //         });
        //         user.save();
        //     }
        // });
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