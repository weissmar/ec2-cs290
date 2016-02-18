var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/', function(req, res){
	res.render('home');
});

app.get('/get-post-checker', function(req,res){
	var qParams = [];
	for (var p in req.query){
		qParams.push({'name':p, 'value':req.query[p]});
	}
	var context = {};
	context.queryList = qParams;
	context.methodType = req.method;
	res.render('get-post-checker', context);
});

app.post('/get-post-checker', function(req,res){
	var queryParams = [];
	var bodyParams = [];
	for (var p in req.query){
		queryParams.push({'name':p, 'value':req.query[p]});
	}
	for (var p in req.body){
		bodyParams.push({'name':p, 'value':req.body[p]});
	}
	var context = {};
	context.queryList = queryParams;
	context.bodyList = bodyParams;
	context.methodType = req.method;
	res.render('get-post-checker', context);
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