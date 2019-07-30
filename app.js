//const http = require('http');
//not needed because of app.listen()
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
//import handlebars module as its not part of express package
//const expressHbs = require('express-handlebars');

const errorController = require('./controllers/error');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');



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

app.use((req, res, next) => {   // npm start runs sequelize not this middleware. Only registered for inc requests, therefore guaranteed to find a user
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }); // Product has one-to-many relationship with User where products delete if user is deleted
User.hasMany(Product); // User may have many products hence one user to many products relationship. Inverse, do not need

User.hasOne(Cart);
Cart.belongsTo(User); // Inverse of above. Do not need

Cart.belongsToMany(Product, { through: CartItem }); // Many-to-Many relationship
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);  // One-to-Many relationship
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem }); // Many-to-Many relationship

sequelize
    // .sync({ force: true })
    .sync()
    .then(result => {
        User.findByPk(1);
        // console.log(result);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Lawangin', email: 'test@test@gmail.com' }); // returns dummy user for testing
        }
        return user; // same as Promise.resolve(user);
    })
    .then(user => {
        console.log(user);
        return user.createCart();
    })
    .then(user => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

//const server = http.createServer(app);
//server.listen(3000);
//same as below
//app.listen(3000);