angular.module('starter')
 
.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.username = AuthService.username();
 
  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });
 
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
 
  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };
})


.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
  $scope.data = {};
 
  $scope.login = function(data) {
    AuthService.login(data).then(function(authenticated) {
      $state.go('main.home.tab');
      $scope.data = {};
      $scope.setCurrentUsername(data.username);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  };
})

.controller('RegisterCtrl', function($scope, $state, $ionicPopup, AuthService) {
  $scope.data = {};
 
  $scope.register = function(data) {
    AuthService.register(data).then(function(response) {
      var alertPopup = $ionicPopup.alert({
        title: 'Registration Successful!',
        template: response
      });
      $scope.data = {};
      $state.go('main.login');
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Registration failed!',
        template: err
      });
    });
  };
})

.controller('CreateEvent', function($scope, $state, $http, $ionicPopup, $stateParams, AuthService, $cordovaCamera, EventService, API_ENDPOINT, ionicDatePicker) {
      $scope.images = [];
      $scope.data = {};
  
  var ipObj1 = {
      callback: function (val) {  //Mandatory
        //console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.data.date = new Date(val);
      },
      disabledDates: [            //Optional
        
      ],
      from: new Date(), //Optional
      to: new Date(2020, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };
    
   $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };
  
  $scope.takePhoto = function () {
                  var options = {
                    quality: 75,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    sourceType: navigator.camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: navigator.camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
   
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                        $scope.data.image = imageData;
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
                }
                
                $scope.choosePhoto = function () {
                  var options = {
                    quality: 75,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: true,
                    encodingType: navigator.camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
   
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                        $scope.data.image = imageData;
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
                }
                
        $scope.create = function(){
          // Create Base64 Object
          //var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
          
          // Encode the String
          //var ImageBase64 = Base64.encode($scope.data.image);
          
            var event_data = {
              title : $scope.data.title,
              date  : $('input[name="exact_date"]').val(),
              image : $scope.data.image
            }
              EventService.CreateEvent(event_data).then(function(response){
                  var data = response.data;
                  if(data.status) {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Create Event',
                      template: 'Event Created Successfully.'
                    });
                    $scope.data = {};
                  }
                  else{
                     var alertPopup = $ionicPopup.alert({
                      title: 'Create Event',
                      template: 'Event Creation Failed.'
                    }); 
                  }
              },
              function(response){
                  var alertPopup = $ionicPopup.alert({
                      title: 'Create Event',
                      template: 'Event Creation Failed.'
                    });
              });  
        }
})

.controller('EventCtrl', function($scope, $state, $http, $ionicPopup, $stateParams, AuthService, EventService, API_ENDPOINT) {
  $scope.item = $scope.items = {};
  $scope.root = API_ENDPOINT.url;
  $event = $stateParams;
  
  if ($.isNumeric($event.eventid)) {
    EventService.GetEvent($event).then(
                  function(response){
                  var data = response.data;
                  if (data.status) {
                    $scope.item = data.data[0];
                  }
            
                  }
                  ,function(response){
                  
                  });
  }
  else{
    EventService.GetAllEvents().then(
                  function(response){
                  var data = response.data;
                  if (data.status) {
                    $scope.items = data.data;
                  }
            
                  }
                  ,function(response){
                  
                  });
  }
})

.controller('HomeCtrl', function($scope, $state, $http, $ionicPopup, AuthService, EventService, API_ENDPOINT) {
  
  $scope.items = [];
  $scope.no_items = true;
  $scope.msg = null;
  
  $scope.root = API_ENDPOINT.url;
  
 
  EventService.GetTrendingNow().then(function(response){
    var data = response.data;
    if (data.status) {
      //console.log(data.data);
      $scope.no_items = false;
      $scope.items = data.data;
    }
    else{
      $scope.msg = data.msg;
    }
  }, function(response){ $scope.msg = 'Error Occurred.';});

  $scope.performValidRequest = function() {
    $http.get('http://localhost:8100/valid').then(
      function(result) {
        $scope.response = result;
      });
  };
 
  $scope.performUnauthorizedRequest = function() {
    $http.get('http://localhost:8100/notauthorized').then(
      function(result) {
        // No result here..
      }, function(err) {
        $scope.response = err;
      });
  };
 
  $scope.performInvalidRequest = function() {
    $http.get('http://localhost:8100/notauthenticated').then(
      function(result) {
        // No result here..
      }, function(err) {
        $scope.response = err;
      });
  };
})
