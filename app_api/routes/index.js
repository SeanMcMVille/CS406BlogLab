var express = require('express');
var router = express.Router();
var jwt = require('express-jwt'); 
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var ctrlBlogs = require('../controllers/blogs');
var ctrlAuth = require('../controllers/authentication');

router.get('/blogs', ctrlBlogs.blogList);
router.get('/blogs/:blogId', ctrlBlogs.blogGet);
router.post('/blogs/blogAdd', auth, ctrlBlogs.blogAdd);
router.put('/blogs/:blogId', auth, ctrlBlogs.blogEdit);
router.delete('/blogs/:blogId', auth, ctrlBlogs.blogDelete);
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;