// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ionic-datepicker'])

.run(function($ionicPlatform, $rootScope, $state, AuthService, AUTH_EVENTS) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
  //console.log(next);
    if ('data' in next && 'user' in next.data) {
      if (!AuthService.isAuthenticated()) {
        event.preventDefault();
        $state.go('main.home.tab');
        //$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      }
    }
 
    var pattern = /main.loggedin\./g;
    
    if (pattern.test(next.name)) {
        if (!AuthService.isAuthenticated()) {
            event.preventDefault();
            $state.go('login');
        } 
    }
    
    var login_pattern = /main.login/g, register_pattern = /main.register/g;
    
    
    if (login_pattern.test(next.name) || register_pattern.test(next.name) ) {
      if (AuthService.isAuthenticated()) {
            event.preventDefault();
            $state.go('main.home.tab');
        }
    }
    
  });
    
})

.config(function ($stateProvider, $urlRouterProvider, USER_ROLES) {
  $stateProvider
  .state('main', {
    url: '/',
    abstract: true,
    templateUrl: 'templates/main.html',
    controller: function(AuthService, $scope, $state){
      $scope.authenticated = AuthService.isAuthenticated();
      
      $scope.logout = function() {
        AuthService.logout();
        $state.go('main.login');
      };
      
      $scope.$on('authentication-change', function(event, args){
        //console.log(event, args);
        $scope.authenticated = args.authentication;
      });
      
      //console.log($scope.authenticated);
    }
  })
  .state('main.login', {
    url: 'login',
    views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
    }
  })
  .state('main.register', {
    url: 'register',
    views: {
        'menuContent': {
          templateUrl: 'templates/register.html',
          controller: 'RegisterCtrl'
        }
    }
  })
  .state('main.home', {
    url: 'home',
    views: {
        'menuContent': {
          templateUrl: 'templates/tabs.html'          
        }
    },
    abstract: true
    
  })
  .state('main.home.tab', {
    url: '/hometab',
    views: {
        'home-tab': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
    }
  })
  .state('main.home.event', {
    url: '/event/:eventid',
    views: {
        'home-tab': {
          templateUrl: 'templates/event.html',
          controller: 'EventCtrl'
        }
    }
  })
  .state('main.home.allevents', {
    url: '/allevents',
    views: {
        'allevents-tab': {
          templateUrl: 'templates/allevents.html',
          controller: 'EventCtrl'
        }
    }
  })
  .state('main.home.allevent', {
    url: '/allevent/:eventid',
    views: {
        'allevents-tab': {
          templateUrl: 'templates/event.html',
          controller: 'EventCtrl'
        }
    }
  })
  .state('main.create_event', {
    url: 'create',
    views: {
        'menuContent': {
          templateUrl: 'templates/create.html',
          controller : 'CreateEvent'
        }
    },
    data : {user: USER_ROLES.user}
  });
  
  // Thanks to Ben Noblet!
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("main.home.tab");
  });
})
