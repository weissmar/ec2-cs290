
var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret:'SuperSecretPasscode'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/', function(req, res, next){
	var context = {};
	request('http://api.openweathermap.org/data/2.5/weather?q=lakeview,or&appid=37531e6c34f0f28fb2d989292cb1cabd', function(err, response, body){
		if (!err && response.statusCode < 400){
			var dataStuff = JSON.parse(body);
			context.lakeviewWeather = {};
			context.lakeviewWeather.temp = dataStuff.main.temp;
			context.lakeviewWeather.weather = dataStuff.weather[0].description;
			console.log(body);
			request('http://api.openweathermap.org/data/2.5/weather?q=corvallis,or&appid=37531e6c34f0f28fb2d989292cb1cabd', function(err, response, body){
				if (!err && response.statusCode < 400){
					var dataStuff = JSON.parse(body);
					context.corvallisWeather = {};
					context.corvallisWeather.temp = dataStuff.main.temp;
					context.corvallisWeather.weather = dataStuff.weather[0].description;
					console.log(body);
					res.render('home', context);
				} else {
					console.log(err);
					if (response){
						console.log(response.statusCode);
					}
					next(err);
				}
			});
		} else {
			console.log(err);
			if (response){
				console.log(response.statusCode);
			}
			next(err);
		}
	});
});

app.get('/count', function(req,res){
	var context = {};
	context.count = req.session.count || 0;
	req.session.count = context.count + 1;
	res.render('counter', context);
});

app.use(function(req,res){
	res.status(404);
	res.render('404');
});

app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express started on http:localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});