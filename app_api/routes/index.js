var express = require('express');
var router = express.Router();
var ctrlBlogs = require('../controllers/blogs');

router.get('/blogs', ctrlBlogs.blogList);
router.get('/blogs/:blogId', ctrlBlogs.blogGet);
router.post('/blogs/blogAdd', ctrlBlogs.blogAdd);
router.put('/blogs/:blogId', ctrlBlogs.blogEdit);
router.delete('/blogs/:blogId', ctrlBlogs.blogDelete);

module.exports = router;