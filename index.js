var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}))
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/auth/linkedin', function(req, res) {
	console.log(req.body);
	
	var reqBody = req.body;
	var serializedData = {
    "grant_type": "authorization_code",
    "code": reqBody.code,
    "redirect_uri": "https://sleepy-wildwood-51219.herokuapp.com/",
    // "redirect_uri": "http://localhost:5000/",
    "client_id": "816dleijgt4exs",
    "client_secret": "HDUsxzoTv0MrwGJG"
  };
  request.post({url: 'https://www.linkedin.com/oauth/v2/accessToken/', form: serializedData}, function(err, httpResponse, body){
  	console.log(arguments);
  	res.send(body);
	  res.end();
  });
});

app.post('/info/linkedin', function(req, res) {
	console.log(req.body);
	
	var reqBody = req.body,
	accessToken = reqBody.accessToken;
  var url = 'https://api.linkedin.com/v1/people/~?oauth2_access_token='+accessToken+'&format=json';
  request({url: url}, function(err, httpResponse, body){
  	console.log(arguments);
  	res.send(body);
	  res.end();
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


