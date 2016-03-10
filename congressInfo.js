var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

function getMembersByState(context, callback){
	var responseCount = 2;
	var yourAPIKey = '03c818cec948c0ff83a6f6d7483d0561:11:73739578';
	var requestURIHouse = 'http://api.nytimes.com/svc/politics/v3/us/legislative/congress/members/house/';
	requestURIHouse += context.state + '/' + context.district + '/current.json?api-key=' + yourAPIKey;
	request(requestURIHouse, function(err, response, body){
		if(!err && response.statusCode < 400){
			var responseData = JSON.parse(body);
			context.houseRepName = responseData.results[0].name;
			context.houseRepParty = responseData.results[0].party;
			context.houseRepId = responseData.results[0].id;
		} else {
			console.log(err);
			if (response){
				console.log(response.statusCode);
			}
		}
		responseCount--;
		if (responseCount == 0){
			callback(context);
		}
	});
	var requestURISenate = 'http://api.nytimes.com/svc/politics/v3/us/legislative/congress/members/senate/';
	requestURISenate += context.state + '/current.json?api-key=' + yourAPIKey;
	request(requestURISenate, function(err, response, body){
		if(!err && response.statusCode < 400){
			var responseData = JSON.parse(body);
			context.senateRep1Name = responseData.results[0].name;
			context.senateRep1Party = responseData.results[0].party;
			context.senateRep1Id = responseData.results[0].id;
			context.senateRep2Name = responseData.results[1].name;
			context.senateRep2Party = responseData.results[1].party;
			context.senateRep2Id = responseData.results[1].id;
		} else {
			console.log(err);
			if (response){
				console.log(response.statusCode);
			}
		}
		responseCount--;
		if (responseCount == 0){
			callback(context);
		}
	});
}

app.get('/', function(req,res,next){
	var context = {};

	res.render('congressInfo', context);
});

app.post('/', function(req,res){
	var context = {};

	context.state = req.body.state;
	context.district = req.body.district;
	getMembersByState(context, function(context){
		res.render('congressInfo', context);
	});
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