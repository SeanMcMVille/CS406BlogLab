var request = require('request');
var apiOptions = {
  server : "http://localhost:80"
};

/* blog list page */
var renderBlogList = function(req, res, responseBody) {
  var message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "There are currently no blogs";
    }
  }
  res.render('blogList', {
    title: 'Blog List',
    blogs: responseBody,
    message: message
  });
}

module.exports.blogList = function (req, res) {
  var requestOptions, path;
  path = '/api/blogs';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      renderBlogList(req, res, body);
    }
  );
};
/* End Blog List Page*/

/* blog add page*/
module.exports.doBlogAdd = function(req, res){
  var requestOptions, path, postdata;
  path = "/api/blogs/blogAdd";
  postdata = {
    blogTitle: req.body.blogTitle,
    blogText: req.body.blogText,
    createDate: req.body.date
  };
  requestOptions = {
    url : apiOptions.server + path,
    method : "POST",
    json : postdata
  };
  if (!postdata.blogTitle) {
    res.redirect('/blogAdd');
  } else {
    request(
      requestOptions,
      function(err, response, body) {
        if (response.statusCode === 201) {
          res.redirect('/blogList');
        } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
          console.log("Validation error: Title is required");
          res.redirect('/blogAdd');
        } else {
          console.log(body);
          _showError(req, res, response.statusCode);
        }
      }
    );
  }
};

module.exports.blogAdd = function (req, res) {
  res.render('blogAdd', { title: 'Blog Add' });
};
/* End Blog Add Page*/

/* Get Single Blog */
var getBlog = function (req, res, callback) {
  var requestOptions, path;
  path = "/api/blogs/" + req.params.blogId;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      if (response.statusCode === 200) {
        callback(req, res, body);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

/* GET blog edit page*/
module.exports.doBlogEdit = function(req, res){
  var requestOptions, path, putdata;
  path = "/api/blogs/" + req.params.blogId;
  putdata = {
    blogTitle: req.body.blogTitle,
    blogText: req.body.blogText,
    createDate: req.body.date
  };
  requestOptions = {
    url : apiOptions.server + path,
    method : "PUT",
    json : putdata
  };
  if (!putdata.blogTitle) {
    res.redirect(path);
  } else {
    request(
      requestOptions,
      function(err, response, body) {
        if (response.statusCode === 200) {
          res.redirect('/blogList');
        } else {
          console.log(body);
          _showError(req, res, response.statusCode);
        }
      }
    );
  }
};

var renderBlogEdit = function (req, res, blog) {
  res.render('blogEdit', {
    title: blog.blogTitle,
    blog: blog
  });
};

module.exports.blogEdit = function (req, res) {
  getBlog(req, res, function(req, res, responseData) {
    renderBlogEdit(req, res, responseData);
  });
};
/* End Blog Edit Page*/

/* GET blog Delete page*/
module.exports.doBlogDelete = function(req, res){
  var requestOptions, path;
  path = "/api/blogs/" + req.params.blogId;
  requestOptions = {
    url : apiOptions.server + path,
    method : "DELETE",
    json: {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      if (response.statusCode === 204) {
        res.redirect('/blogList');
      } else {
        console.log(body);
        _showError(req, res, response.statusCode);
      }
    }
  );
};

var renderBlogDelete = function (req, res, blog) {
  res.render('blogDelete', {
    title: blog.blogTitle,
    blog: blog
  });
};

module.exports.blogDelete = function (req, res) {
  getBlog(req, res, function(req, res, responseData) {
    renderBlogDelete(req, res, responseData);
  });
};
/* End Blog Delete Page*/
