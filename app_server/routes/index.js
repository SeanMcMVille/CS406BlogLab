var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');


router.get('/', ctrlHome.home);

/* Blogs */
router.get('/blogList', ctrlBlog.blogList);

router.get('/blogAdd', ctrlBlog.blogAdd);
router.post('/blogAdd', ctrlBlog.doBlogAdd);

router.get('/blogEdit/:blogId', ctrlBlog.blogEdit);
router.post('/blogEdit/:blogId', ctrlBlog.doBlogEdit);

router.get('/blogDelete/:blogId', ctrlBlog.blogDelete);
router.post('/blogDelete/:blogId', ctrlBlog.doBlogDelete);

module.exports = router;
