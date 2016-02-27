
var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret:'SuperSecretPasscode'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/', function(req, res){
	res.render('home');
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