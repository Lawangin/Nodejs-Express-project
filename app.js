//const http = require('http');
//not needed because of app.listen()
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
//import handlebars module as its not part of express package
//const expressHbs = require('express-handlebars');

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

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    //one way to path ro html page using path.join()
    //res.status(404).sendFile(path.join(__dirname, 'Views', 'page-not-found.html'));

    //renders pug/handlebar/ejs pages in the views folder
    res.render('page-not-found', { pageTitle: 'page not found' });
});

//const server = http.createServer(app);
//server.listen(3000);
//same as below
app.listen(3000);