exports.get404 = (req, res, next) => {
    //one way to path to html page using path.join()
    //res.status(404).sendFile(path.join(__dirname, 'Views', 'page-not-found.html'));

    //renders pug/handlebar/ejs pages in the views folder
    res.status(404).render('404', {
        pageTitle: 'page not found',
        path: '/404',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.get500 = (req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Server Error',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
};