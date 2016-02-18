var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.use('/', function(req, res){
	res.render('home')
});

app.use('/form-results', function(req,res){
	var qParams = [];
	for (var p in req.body){
		qParams.push({'name':p, 'value':req.body[p]})
	}
	var context = {};
	context.dataList = qParams;
	res.render('form-results', req.method, context);
})

app.listen(app.use('port'), function(){
	console.log('Express started on http:localhost:' + app.use('port') + '; press Ctrl-C to terminate.');
});