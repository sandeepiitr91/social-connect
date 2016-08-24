// Code goes here


var app = angular.module('testUserAuth', ['ui.router']);
app.config(function($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('root', {
      url: '/',
      template: '<div><pre>{{ctrl.response | json}}</pre></div>\
        <div ng-if="ctrl.step == 1"><button><a href="http://www.linkedin.com/oauth/v2/authorization?client_id=816dleijgt4exs&response_type=code&redirect_uri=https://sleepy-wildwood-51219.herokuapp.com/&state=XXXA354S78D968ASDA789SD8567rg456ASD&scope=r_basicprofile">Start First Step</a></button></div>\
        </div><div ng-if="ctrl.step == 2"><button ng-click="ctrl.startSecondStep()">Start Second Step</button></div>\
      ',
      controller: 'MainCtrl',
      controllerAs: 'ctrl'
    });

});
app.controller('MainCtrl', ['$http', '$location', '$state', '$stateParams', function($http, $location, $state, $stateParams){
  this.step = 1;
  this.response = $location.search();
  if(!!this.response && this.response.code) {
    this.step = 2;
  }
  this.startSecondStep = function () {
    serializedData = {
      "grant_type": "authorization_code",
      "code": this.response.code,
      "redirect_uri": "https://sleepy-wildwood-51219.herokuapp.com",
      "client_id": "816dleijgt4exs",
      "client_secret": "HDUsxzoTv0MrwGJG"
    };

    $http({
      method: 'POST',
      url: 'https://www.linkedin.com/oauth/v2/accessToken',
      data: serializedData,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      }}).then(function (response) {
        console.log(response);
        this.step = 3;
        this.response = response;
      }.bind(this));  
  };

  this.startThirdStep = function() {
      $http.po
  };

	this.addUser = function() {
  	var user = this.createUser();
  	// $http.post('http://dev.datetheramp.com/dev/api/app/user/invites/requests/', user).then(function(data){
   //  	console.log("Success");
   //  }, function(data){
   //  	console.log("Failure");
   //  });
   $http.get("https://www.linkedin.com/oauth/v2/authorization", {
        params: {
            "response_type": "code",
            "client_id": '81ljsncw1be1qi',
            "redirect_uri": "https://localhost:63342/auth/linkedin/callback",
            "state": "XXXYXYXYX",
            "scope": "r_basicprofile"
        }
    }).then(function (response) { / /
            console.log(response);
    }.bind(this));
  }
  this.createUser = function(){
  	var num = parseInt('999' + Math.random() * 10000000);
  	return {
    	email: 'test_user_' + num + '@gmail.com',
      name: 'Test User',
      mobile: num
    }
	}
}]);