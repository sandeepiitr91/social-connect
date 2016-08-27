// Code goes here


var app = angular.module('testUserAuth', ['ui.router', 'satellizer']);
app.config(function($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {
  $authProvider.linkedin({
    'clientId': '816dleijgt4exs',
    'responseType': 'code'
  })
  $locationProvider.html5Mode(true);
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('root', {
      url: '/',
      template: '<div><pre>{{ctrl.response | json}}</pre></div>\
        <div ng-if="ctrl.step == 1"><button ng-click="ctrl.startFirstStep()">Start First Step</button></div>\
        <div ng-if="ctrl.step == 2"><button ng-click="ctrl.startSecondStep()">Start Second Step</button></div>\
        <div ng-if="ctrl.step == 3"><button ng-click="ctrl.startThirdStep()">Start Third Step</button></div>\
      ',
      controller: 'MainCtrl',
      controllerAs: 'ctrl'
    });

});
app.controller('MainCtrl', ['$auth', '$http', '$q', '$window', '$interval', '$timeout', '$location', '$state', '$stateParams', 'SatellizerPopup', function($auth, $http, $q, $window, $interval, $timeout, $location, $state, $stateParams, SatellizerPopup){
  this.step = 1;
  this.response = $location.search();
  if(!!this.response){
    if(this.response.code) {
      $location.search({});
      this.step = 2;
    }
  } 

  this.startFirstStep = function(){
    window.location.href = "https://www.linkedin.com/oauth/v2/authorization?client_id=816dleijgt4exs&response_type=code&redirect_uri=http://localhost:5000/&state=XXXA354S78D968ASDA789SD8567rg456ASD&scope=r_basicprofile";
  }

  this.startSecondStep = function () {
    $http({
      method: 'POST',
      url: '/auth/linkedin',
      data: this.response,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      console.log(response);
      this.step = 3;
      this.response = response.data;
      this.accessToken = this.response.access_token;
    }.bind(this)); 
  };

  this.startThirdStep = function () {
    if(!this.accessToken) { return; }
    $http({
      method: 'POST',
      url: '/info/linkedin',
      data: {
        "accessToken" : this.accessToken
      },
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(function (response) {
      console.log(response);
      this.step = 1;
      this.response = response.data;
    }.bind(this)); 
  }
}]);
