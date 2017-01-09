angular.module('starter')
 
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
 
.constant('USER_ROLES', {
  user: true
})

.constant('API_ENDPOINT', {
  url: 'http://localhost:8100/vancuover/'
  //localhost:8100
  //  For a simulator use: url: 'http://127.0.0.1:8080/api'
});