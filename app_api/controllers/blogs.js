var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.blogList = function (req, res) {
  Blog
    .find()
    .exec(function(err, blog) {
      if (!blog) {
        sendJSONresponse(res, 404, {
          "message": "no blogs found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      console.log(blog);
      sendJSONresponse(res, 200, blog);
    });
};

module.exports.blogGet = function (req, res) {
  console.log('Finding blog details', req.params);
  if (req.params && req.params.blogId) {
    Blog
      .findById(req.params.blogId)
      .exec(function(err, blog) {
        if (!blog) {
          sendJSONresponse(res, 404, {
            "message": "blogId not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(blog);
        sendJSONresponse(res, 200, blog);
      });
  } else {
    console.log('No blogId specified');
    sendJSONresponse(res, 404, {
      "message": "No blogId in request"
    });
  }
};

module.exports.blogAdd = function (req, res) {
  console.log(req.body);
  Blog
    .create({
      blogTitle: req.body.blogTitle,
      blogText: req.body.blogText,
      createDate: req.body.date
    }, function(err, blog) {
      if (err) {
        console.log(err);
       sendJSONresponse(res, 400, err);
     } else {
       console.log(blog);
       sendJSONresponse(res, 201, blog);
      }
  });
};

module.exports.blogEdit = function (req, res) {
  if (!req.params.blogId) {
    sendJSONresponse(res, 404, {
      "message": "blogId not found"
    });
    return;
  }
  Blog
    .findById(req.params.blogId)
    .exec(function(err, blog) {
      if (!blog) {
        sendJSONresponse(res, 404, {
          "message": "blogId not found"
        });
        return;
      } else if (err) {
        sendJSONresponse(res, 400, err);
        return;
      }
      blog.blogTitle = req.body.blogTitle;
      blog.blogText = req.body.blogText;
      blog.createDate = req.body.date;
      blog.save(function(err, blog) {
        if (err) {
          sendJSONresponse(res, 404, err);
        } else {
          sendJSONresponse(res, 200, blog);
        }
      });
    }
  );
};

module.exports.blogDelete = function (req, res) {
  var blogId = req.params.blogId;
  if (blogId) {
    Blog
      .findByIdAndRemove(blogId)
      .exec(function(err, location) {
        if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log("Blog id " + blogId + " deleted");
        sendJSONresponse(res, 204, null);
      });
  } else {
    sendJSONresponse(res, 404, {
      "message": "No blogId"
    });
  }
};