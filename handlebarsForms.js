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

app.get('/form-results', function(req,res){
	var qParams = [];
	for (var p in req.query){
		qParams.push({'name':p, 'value':req.query[p]});
	}
	var context = {};
	context.dataList = qParams;
	context.methodType = req.method;
	res.render('form-results', context);
});

app.post('/form-results', function(req,res){
	var qParams = [];
	for (var p in req.body){
		qParams.push({'name':p, 'value':req.body[p]});
	}
	var context = {};
	context.dataList = qParams;
	context.methodType = req.method;
	res.render('form-results', context);
});

app.listen(app.get('port'), function(){
	console.log('Express started on http:localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});