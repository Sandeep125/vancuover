angular.module('starter')

.service('EventService', function($q, $http, USER_ROLES, API_ENDPOINT) {
  
  var service = {};
  
  service.GetTrendingNow = function(){
    console.log(API_ENDPOINT.url + 'mobile/mobileapp/gettrending');
    return $q(function(resolve, reject) {
        $http(
                   {
                    url: API_ENDPOINT.url + 'mobile/mobileapp/gettrending',
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: TransformRequest,
                    data: {}
                   }
                   ).then(function(response){resolve(response);},function(response){reject(response);});
      });
  }
  
  service.GetEvent = function(event_data){
    
    return $q(function(resolve, reject) {
        $http(
                   {
                    url: API_ENDPOINT.url + 'mobile/mobileapp/getevent',
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: TransformRequest,
                    data: event_data
                   }
                   ).then(function(response){resolve(response);},function(response){reject(response);});
      });
  }
  
  
  service.GetAllEvents = function(){
    
    return $q(function(resolve, reject) {
        $http(
                   {
                    url: API_ENDPOINT.url + 'mobile/mobileapp/getallevents',
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: TransformRequest,
                    data: {}
                   }
                   ).then(function(response){resolve(response);},function(response){reject(response);});
      });
  }
  
  service.CreateEvent = function(event_data){
    console.log(event_data);
    return $q(function(resolve, reject) {
        $http(
                   {
                    url: API_ENDPOINT.url + 'mobile/mobileapp/create_event',
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: TransformRequest,
                    data: event_data
                   }
                   ).then(function(response){resolve(response);},function(response){reject(response);});
      });
  }
  
    
  return service;
  
  })
         
.service('AuthService', function($q, $rootScope, $http, USER_ROLES, API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'UserTokenKey';
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }
 
  function useCredentials(token) {
    username = token.split(';')[0];
    isAuthenticated = true;
    $rootScope.$broadcast('authentication-change', {authentication: isAuthenticated });
    authToken = token;
 
    if (username == 'admin') {
      role = USER_ROLES.admin
    }
    if (username == 'user') {
      role = USER_ROLES.public
    }
 
    // Set the token as header for your requests!
    $http.defaults.headers.common['X-Auth-Token'] = token;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $rootScope.$broadcast('authentication-change', {authentication: isAuthenticated });
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
  
  var login = function(user_data) {
    return $q(function(resolve, reject) {
        // Make a request and receive your auth token from your server
        //console.log(
        //            'url '+API_ENDPOINT.url + 'vancuover/mobile/mobileapp/login'
        //            );
        
        $http(
                   {
                    url: API_ENDPOINT.url + 'mobile/mobileapp/login',
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: TransformRequest,
                    data: user_data
                   }
                   ).then(function(response){
          var data = response.data;
            if (data.status) {
              resolve(data.msg);
              var data = data.data;
              storeUserCredentials(data.name+';'+data.jwt);
            } else {
              reject('Login Failed.');
            }
      });
    });
  };
  
  var register = function(user_data) {
    return $q(function(resolve, reject) {
        $http(
                   {
                    url: API_ENDPOINT.url + 'mobile/mobileapp/register',
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: TransformRequest,
                    data: user_data
                   }
                   ).then(function(response){
          var data = response.data;
            if (data.status) {
              resolve(data.msg);
            } else {
              reject(data.msg);
            }
      });
    });
  };
  
  var logout = function() {
    destroyUserCredentials();
  };
 
  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };
 
  loadUserCredentials();
 
  return {
    login: login,
    logout: logout,
    register: register,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;},
    role: function() {return role;}
  };
})

.factory('Camera', ['$q', function($q) {
 
  return {
    getPicture: function(options) {
      var q = $q.defer();
      
      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      
      return q.promise;
    }
  }
}])

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});

function TransformRequest(obj) {
                        
                        var str = [];
                        for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    }