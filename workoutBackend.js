var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var mysql = require('mysql');
var pool = mysql.createPool({
	host: 'localhost',
	user: 'student',
	password: 'default',
	database: 'student'
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.post('/addExercise', function(req,res,next){
	console.log(req.body.name + "  " + req.body.reps + "  " + req.body.weight + "  " + req.body.date + "  " + req.body.lbs);
	pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)", 
		[req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], 
		function(err, result){
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

app.post('/updateExercise', function(req,res,next){
	pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?", 
		[req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs, req.body.id], 
		function(err, result){
		if(err){
			next(err);
			return;
		}
		pool.query("SELECT * FROM workouts WHERE id=?", [req.body.id], function(err, rows, fields){
			if(err){
				next(err);
				return;
			}
			res.type('text/plain');
			res.send(JSON.stringify(rows[0]));
		});
	});
});

app.post('/deleteExercise', function(req,res,next){
	pool.query("DELETE FROM workouts WHERE id=?", [req.body.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		res.type('text/plain');
		res.send(JSON.stringify(result));
	});
});

app.get('/getTable', function(req,res,next){
	pool.query("SELECT * FROM workouts", function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		res.type('text/plain');
		res.send(JSON.stringify(rows));
	});
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ 
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('resetTable',context);
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