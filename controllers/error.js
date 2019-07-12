exports.get404 = (req, res, next) => {
    //one way to path ro html page using path.join()
    //res.status(404).sendFile(path.join(__dirname, 'Views', 'page-not-found.html'));

    //renders pug/handlebar/ejs pages in the views folder
    res.status(404).render('404', { pageTitle: 'page not found' });
}