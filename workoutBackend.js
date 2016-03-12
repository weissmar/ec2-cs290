var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var mysql = require('mysql');
var pool = mysql.createPool({
	host: 'localhost',
	user: 'student',
	password: 'default',
	database: 'student'
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('port', 3000);

app.post('/addExercise', function(req,res,next){
	pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)", 
		[req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
		if(err){
			next(err);
			return;
		}
		pool.query("SELECT * FROM workouts WHERE id=?", [result.insertId], function(err, rows, fields){
			if(err){
				next(err);
				return;
			}
			res.type('text/plain');
			res.send(JSON.stringify(rows[0]));
		});
	});
});

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});