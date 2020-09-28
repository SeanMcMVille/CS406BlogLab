/* GET blog list page */
module.exports.blogList = function (req, res) {
    res.render('blogList', {
        title: 'Blog List',
        blogs: [{
            blogTitle: 'Title1',
            blogText: 'Text1',
            createDate: new Date(2020, 09, 27)
        }, {
            blogTitle: 'Title2',
            blogText: 'Text2',
            createDate: new Date(2020, 09, 27)
        }, {
            blogTitle: 'Title3',
            blogText: 'Text3',
            createDate: new Date(2020, 09, 27)
        }]
    });
};

/* GET blog add page*/
module.exports.blogAdd = function (req, res) {
    res.render('blogAdd', { title: 'Blog Add' });
};

/* GET blog edit page*/
module.exports.blogEdit = function (req, res) {
    res.render('blogEdit', { title: 'Blog Edit' });
};

/* GET blog delete page*/
module.exports.blogDelete = function (req, res) {
    res.render('blogDelete', { title: 'Blog Delete' });
};