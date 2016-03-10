//these get all of our dependencies set up and configured for our use
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

//we'll add the request and data extraction in this function
function getMembersByState(context, callback){
	callback(context);
}

//this displays the page when the user navigates there or refreshes the page
app.get('/', function(req,res,next){
	var context = {};
	res.render('congressInfo', context);
});

//this receives the data from the page and then re-renders it
app.post('/', function(req,res){
	var context = {};
	context.state = req.body.state;
	context.district = req.body.district;
	getMembersByState(context, function(context){
		res.render('congressInfo', context);
	});
});

//some error handling
app.use(function(req,res){
	res.status(404);
	res.render('404');
});

//more error handling
app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

//this will allow the application to run on Node
app.listen(app.get('port'), function(){
	console.log('Express started on http:localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});