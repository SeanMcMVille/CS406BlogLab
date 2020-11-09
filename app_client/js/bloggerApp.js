var app = angular.module('bloggerApp', ['ngRoute']);

//Router Provider
app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'pages/home.html',
      controller: 'HomeController',
      controllerAs: 'vm'
    })

    .when('/blogList', {
      templateUrl: 'pages/blogList.html',
      controller : 'ListController',
      controllerAs: 'vm'
    })

    .when('/blogAdd', {
      templateUrl: 'pages/blogAdd.html',
      controller: 'AddController',
      controllerAs: 'vm'
    })

    .when('/blogEdit/:id', {
      templateUrl: 'pages/blogEdit.html',
      controller: 'EditController',
      controllerAs: 'vm'
    })

    .when('/blogDelete/:id', {
      templateUrl: 'pages/blogDelete.html',
      controller: 'DeleteController',
      controllerAs: 'vm'
    })

    .when('/register', {
      templateUrl: '/auth/register.view.html',
      controller: 'RegisterController',
      controllerAs: 'vm'
    })

    .when('/signOn', {
      templateUrl: '/auth/login.view.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    })

    .otherwise({redirectTo: '/'});
});

//REST API functions
function getAllBlogs($http) {
  return $http.get('/api/blogs');
}

function getBlogById($http, id) {
  return $http.get('/api/blogs/' + id);
}

//function addBlog($http, data) {
//  return $http.post('/api/blogs/blogAdd', data);
//}

function addBlog($http, authentication, data) {
  return $http.post('/api/blogs/blogAdd', data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

//function updateBlogById($http, id, data) {
//  return $http.put('/api/blogs/' + id, data);
//}

function updateBlogById($http, authentication, id, data) {
  return $http.put('/api/blogs/' + id, data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

//function deleteBlogById($http, id) {
//  return $http.delete('/api/blogs/' + id);
//}

function deleteBlogById($http, authentication, id) {
  return $http.delete('/api/blogs/' + id, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

//Controllers
app.controller('HomeController', function HomeController() {
  var vm = this;
  vm.pageHeader = {
      title: "Sean's Blog"
  };
  vm.message = "Welcome to my blog site.";
});

app.controller('ListController', ['$http', 'authentication', function ListController($http, authentication) {
  var vm = this;
  vm.pageHeader = {
    title: "Blog List"
  };
  vm.message = "Retriving blogs";
  getAllBlogs($http)
    .then(function (data) {
      vm.blogs = data.data;
      vm.message = "";
    }
    , (function (e) {
      vm.message = "Could not get blogs";
    }));
  
  vm.postOwner = function() {
    return authentication.currentUser();
  }
}]);

app.controller('AddController', [ '$http', '$location', 'authentication', function AddController($http, $location, authentication) {
  var vm = this;
  vm.blog = {};
  vm.pageHeader = {
    title: 'Blog Add'
  };
  vm.message = "";

  var userInfo = authentication.currentUser();

  vm.submit = function() {
    var data = vm.blog;
    data.blogTitle = userForm.blogTitle.value;
    data.blogText = userForm.blogText.value;
    data.email = userInfo.email;
    data.name = userInfo.name;

    addBlog($http, authentication, data)
      .then(function(data) {
        $location.path('blogList');
      }
      , (function (e) {
        vm.message = "Could not add blog"
      }));
  }
}]);

app.controller('EditController', [ '$http', '$routeParams', '$location', 'authentication', function EditController($http, $routeParams, $location, authentication) {
  var vm = this;
  vm.blog = {};
  vm.id = $routeParams.id;
  vm.pageHeader = {
    title: 'Blog Edit'
  };
  vm.message = "Getting Blog";

  getBlogById($http, vm.id)
    .then(function(data) {
      vm.blog = data.data;
      vm.message = "";
    }
    , (function (e) {
      vm.message = "Could not retrieve blog at ID " + vm.id;
    }));

  vm.submit = function() {
    var data = vm.blog;
    data.blogTitle = userForm.blogTitle.value;
    data.blogText = userForm.blogText.value;

    updateBlogById($http, authentication, vm.id, data)
      .then(function(data) {
        vm.message = "";
        $location.path('blogList');
      }
      , (function (e) {
        vm.message = "Could not update blog at ID " + vm.id;
      }));
  }
}]);

app.controller('DeleteController', [ '$http', '$routeParams', '$location', 'authentication', function DeleteController($http, $routeParams, $location, authentication) {
  var vm = this;
  vm.blog = {};
  vm.id = $routeParams.id;
  vm.pageHeader = {
    title: 'Blog Delete'
  };
  vm.message = "Getting Blog";

  getBlogById($http, vm.id)
  .then(function(data) {
    vm.blog = data.data;
    vm.message = "";
  }
  , (function (e) {
    vm.message = "Could not retrieve blog at ID " + vm.id;
  }));

  vm.submit = function() {
    deleteBlogById($http, authentication, vm.id)
      .then(function(data) {
        $location.path('blogList');
      }
      , (function (e) {
        vm.message = "Could not delete blog"
      }));
  }

  vm.cancel = function() {
    $location.path('blogList');
  }
}]);