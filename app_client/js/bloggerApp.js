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

    .when('/blogChat', {
      templateUrl: 'pages/blogChat.html',
      controller: 'ChatController',
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

function addBlog($http, authentication, data) {
  return $http.post('/api/blogs/blogAdd', data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

function updateBlogById($http, authentication, id, data) {
  return $http.put('/api/blogs/' + id, data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

function deleteBlogById($http, authentication, id) {
  return $http.delete('/api/blogs/' + id, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

function getChat($http) {
  return $http.get('/api/chat');
}

function updateChat($http, authentication, data) {
  return $http.post('/api/chat', data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
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

app.controller('ChatController', [ '$http', '$scope', '$interval', 'authentication', 
  function ChatController($http, $scope, $interval, authentication) {
    var vm = this;
    vm.pageHeader = {
      title: 'Chat'
    };

    getChat($http)
    .then(function(data) {
      vm.chat = data.data.map(function (messages) {return (messages.name + ": " + messages.chat);}).join('\n');
      vm.message = "";
      $('#chatField').scrollTop($('#chatField')[0].scrollHeight);
    }
    , (function (e) {
      vm.message = "Could not retrieve chat";
    }));

    var userInfo = authentication.currentUser();

    vm.submit = function() {
      //update the chat DB
      var data = {};
      data.chat = userForm.postField.value;
      data.name = userInfo.name;
      
      updateChat($http, authentication, data)
      .then(function(data) {
        vm.message = "";
      }
      , (function (e) {
        vm.message = "Could not post message";
      }));
    }

    $scope.callAtInterval = function() {
      //Update chatField with chat DB
      getChat($http)
      .then(function(data) {
        //Returns a string using data returned from DB, so I can piece everything together here...
        // seems gross but only way I could think of doing formatting.
        vm.chat = data.data.map(function (messages) {return (messages.name + ": " + messages.chat);}).join('\n');
        vm.message = "";
        $('#chatField').scrollTop($('#chatField')[0].scrollHeight);
      }
      , (function (e) {
        vm.message = "Could not retrieve chat";
      }));
    }
    $interval( function(){$scope.callAtInterval();}, 3000, 0, true);
}]);