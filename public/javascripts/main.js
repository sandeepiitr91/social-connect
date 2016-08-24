// Code goes here


angular.module('testUser', []).config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}).controller('MainCtrl', ['$http', function($http){
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