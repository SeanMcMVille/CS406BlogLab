var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

/* Locations */
router.get('/', ctrlHome.home);
router.get('/blogAdd', ctrlBlog.blogAdd);
router.get('/blogList', ctrlBlog.blogList);
router.get('/blogEdit', ctrlBlog.blogEdit);
router.get('/blogDelete', ctrlBlog.blogDelete);

module.exports = router;
