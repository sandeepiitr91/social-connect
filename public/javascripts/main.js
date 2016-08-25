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
  if(!!this.response){
    if(this.response.code) {
      $location.search({});
      this.step = 2;
    }
  } this.startSecondStep = function () {
    serializedData = {
      "grant_type": "authorization_code",
      "code": this.response.code,
      "redirect_uri": "https://sleepy-wildwood-51219.herokuapp.com/",
      "client_id": "816dleijgt4exs",
      "client_secret": "HDUsxzoTv0MrwGJG"
    };

    // $http({
    //   method: 'POST',
    //   url: 'https://www.linkedin.com/oauth/v2/accessToken',
    //   data: serializedData,
    //   transformRequest: function(obj) {
    //     var str = [];
    //     for(var p in obj)
    //     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    //     return str.join("&");
    //   },
    //   headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded'
    //   }}).then(function (response) {
    //     console.log(response);
    //     this.step = 3;
    //     this.response = response;
    //   }.bind(this));  
    post('https://www.linkedin.com/oauth/v2/accessToken', serializedData);
  };

  function post(path, params, method) {
      method = method || "post"; // Set method to post by default if not specified.

      // The rest of this code assumes you are not using a library.
      // It can be made less wordy if you use one.
      var form = document.createElement("form");
      form.setAttribute("method", method);
      form.setAttribute("action", path);

      for(var key in params) {
          if(params.hasOwnProperty(key)) {
              var hiddenField = document.createElement("input");
              //hiddenField.setAttribute("type", "hidden");
              hiddenField.setAttribute("name", key);
              hiddenField.setAttribute("value", params[key]);

              form.appendChild(hiddenField);
           }
      }

      document.body.appendChild(form);
      form.submit();
  };
}]);
