
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

app.get('/', function(req,res,next){
	var context = {};
	if (!req.session.name){
		res.render('newSession', context);
		return;
	}

	context.name = req.session.name;
	context.toDoCount = req.session.toDo.length || 0;
	context.toDo = req.session.toDo || [];
	console.log(context.toDo);
	res.render('toDo', context);
});

app.post('/', function(req,res){
	var context = {};

	if(req.body['New List']){
		req.session.name = req.body.name;
		req.session.toDo = [];
		req.session.curId = 0;
	}

	if(!req.session.name){
		res.render('newSession', context);
		return;
	}

	if(req.body['Add Item']){
		req.session.toDo.push({"name":req.body.name, "city":req.body.city, "minTemp":req.body.minTemp, "id":req.session.curId});
		req.session.curId++;
	}

	if(req.body['Done']){
		req.session.toDo = req.session.toDo.filter(function(e){
			return e.id != req.body.id;
		})
	}

	context.name = req.session.name;
	context.toDoCount = req.session.toDo.length;
	context.toDo = req.session.toDo;
	console.log(context.toDo);
	res.render('toDo', context);
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