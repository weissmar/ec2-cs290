var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/', function(req, res){
	res.render('home')
});

function genContext(){
	var stuffToDisplay = {};
	stuffToDisplay.number = Math.rand();
	return stuffToDisplay;
}

app.get('/random-number', function(req,res){
	res.render('random-number', genContext());
});

app.listen(app.get('port'), function(){
	console.log('Express started on http:localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});