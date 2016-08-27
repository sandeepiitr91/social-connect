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
        </div><div ng-if="ctrl.step == 2"><button ng-click="ctrl.startSecondStep()">Start Second Step</button></div>\
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
      // $location.search({});
      this.step = 2;
    }
  } 

  this.startFirstStep = function(){
    window.location.href = "https://www.linkedin.com/oauth/v2/authorization?client_id=816dleijgt4exs&response_type=code&redirect_uri=http://localhost:5000/&state=XXXA354S78D968ASDA789SD8567rg456ASD&scope=r_basicprofile";
    // $auth.authenticate('linkedin');
  }

  this.oAuthGetApproval = function(){
    var q = $q.defer();
    //Open popup
    var serializedData = {
      "grant_type": "authorization_code",
      "code": this.response.code,
      "redirect_uri": "https://sleepy-wildwood-51219.herokuapp.com/",
      "redirect_uri": "http://localhost:5000/",
      "client_id": "816dleijgt4exs",
      "client_secret": "HDUsxzoTv0MrwGJG"
    };
    var uri = 'https://www.linkedin.com/oauth/v2/accessToken/?' + this.transformRequest(serializedData);
    this.popup = $window.open(uri, '', "top=100,left=100,width=500,height=500");
    
    if(this.popup && this.popup.focus){
      this.popup.focus();
    }
    
    $timeout(function(){
      this.popup.addEventListener('load', function(){
        this.popup.close();
      })
    }.bind(this) ,1);

    this.popup.onload = function(){
        this.popup.close();      
    }

    var popupChecker = $interval(function(){
      // if(this.popup) {
      //   this.popup.close();
      // }
      var content = this.popup.location.href;
      if ($window.oAuthUser != undefined){
        //The popup put returned a user! Resolve!
        $q.resolve(window.oAuthUser);
        this.popup.close();
        $interval.cancel(popupChecker);
        //Save and apply user locally
        store.set('currentUser', window.oAuthUser);
        $rootScope.setCurrentUser(window.oAuthUser);
        //Cleanup
        $window.oAuthUser = undefined;
      }else if (this.popup.closed){
        $interval.cancel(popupChecker);
        console.log("Error logging in.");
        q.reject();
      }
      console.log('tick');
    }.bind(this), 1000)

    return q.promise;
  };

  this.transformRequest =  function(obj) {
    var str = [];
    for(var p in obj)
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
  }

  this.startSecondStep = function () {
    $http({
      method: 'POST',
      url: '/auth/linkedin',
      data: this.response,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response) {
      console.log(response);
      this.step = 3;
      this.response = response;
    }.bind(this)); 
    //this.oAuthGetApproval();
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
    //post('https://www.linkedin.com/oauth/v2/accessToken', serializedData);
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

  // var Popup = (function () {
  //       function Popup($interval, $window, $q) {
  //           this.$interval = $interval;
  //           this.$window = $window;
  //           this.$q = $q;
  //           this.popup = null;
  //           this.url = 'about:blank'; // TODO remove
  //           this.defaults = {
  //               redirectUri: null
  //           };
  //       }
  //       Popup.prototype.stringifyOptions = function (options) {
  //           var parts = [];
  //           angular.forEach(options, function (value, key) {
  //               parts.push(key + '=' + value);
  //           });
  //           return parts.join(',');
  //       };
  //       Popup.prototype.open = function (url, name, popupOptions) {
  //           this.url = url; // TODO remove
  //           var width = popupOptions.width || 500;
  //           var height = popupOptions.height || 500;
  //           var options = this.stringifyOptions({
  //               width: width,
  //               height: height,
  //               top: this.$window.screenY + ((this.$window.outerHeight - height) / 2.5),
  //               left: this.$window.screenX + ((this.$window.outerWidth - width) / 2)
  //           });
  //           var popupName = this.$window['cordova'] || this.$window.navigator.userAgent.indexOf('CriOS') > -1 ? '_blank' : name;
  //           this.popup = window.open(this.url, popupName, options);
  //           if (this.popup && this.popup.focus) {
  //               this.popup.focus();
  //           }
  //           //
  //           // if (this.$window['cordova']) {
  //           //   return this.eventListener(this.defaults.redirectUri); // TODO pass redirect uri
  //           // } else {
  //           //   return this.polling(redirectUri);
  //           // }
  //       };
  //       Popup.prototype.polling = function (redirectUri) {
  //           var _this = this;
  //           return this.$q(function (resolve, reject) {
  //               var redirectUriParser = document.createElement('a');
  //               redirectUriParser.href = redirectUri;
  //               var redirectUriPath = getFullUrlPath(redirectUriParser);
  //               var polling = _this.$interval(function () {
  //                   if (!_this.popup || _this.popup.closed || _this.popup.closed === undefined) {
  //                       _this.$interval.cancel(polling);
  //                       reject(new Error('The popup window was closed'));
  //                   }
  //                   try {
  //                       var popupWindowPath = getFullUrlPath(_this.popup.location);
  //                       if (popupWindowPath === redirectUriPath) {
  //                           if (_this.popup.location.search || _this.popup.location.hash) {
  //                               var query = parseQueryString(_this.popup.location.search.substring(1).replace(/\/$/, ''));
  //                               var hash = parseQueryString(_this.popup.location.hash.substring(1).replace(/[\/$]/, ''));
  //                               var params = angular.extend({}, query, hash);
  //                               if (params.error) {
  //                                   reject(new Error(params.error));
  //                               }
  //                               else {
  //                                   resolve(params);
  //                               }
  //                           }
  //                           else {
  //                               reject(new Error('OAuth redirect has occurred but no query or hash parameters were found. ' +
  //                                   'They were either not set during the redirect, or were removed—typically by a ' +
  //                                   'routing library—before Satellizer could read it.'));
  //                           }
  //                           _this.$interval.cancel(polling);
  //                           _this.popup.close();
  //                       }
  //                   }
  //                   catch (error) {
  //                   }
  //               }, 500);
  //           });
  //       };
  //       Popup.prototype.eventListener = function (redirectUri) {
  //           var _this = this;
  //           return this.$q(function (resolve, reject) {
  //               _this.popup.addEventListener('loadstart', function (event) {
  //                   if (!event.url.includes(redirectUri)) {
  //                       return;
  //                   }
  //                   var parser = document.createElement('a');
  //                   parser.href = event.url;
  //                   if (parser.search || parser.hash) {
  //                       var query = parseQueryString(parser.search.substring(1).replace(/\/$/, ''));
  //                       var hash = parseQueryString(parser.hash.substring(1).replace(/[\/$]/, ''));
  //                       var params = angular.extend({}, query, hash);
  //                       if (params.error) {
  //                           reject(new Error(params.error));
  //                       }
  //                       else {
  //                           resolve(params);
  //                       }
  //                       _this.popup.close();
  //                   }
  //               });
  //               _this.popup.addEventListener('loaderror', function () {
  //                   reject(new Error('Authorization failed'));
  //               });
  //               _this.popup.addEventListener('exit', function () {
  //                   reject(new Error('The popup window was closed'));
  //               });
  //           });
  //       };
  //       Popup.$inject = ['$interval', '$window', '$q'];
  //       return Popup;
  //   }());

}]);
