var express = require('express');
var mysql = require('./Dbase');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8765);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/',function(req,res){
    res.render('home');
});

app.post('/', function (req,res,next) {
    var context = {};
    if (req.body['Update']) {
        mysql.pool.query("SELECT * FROM workout2 WHERE id=?", [Number(req.body.id)], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            if (result.length == 1) {
                var curVals = result[0];
                mysql.pool.query("UPDATE workout2 SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?",
                    [req.body.name || curVals.name, req.body.reps || curVals.reps, req.body.weight || curVals.weight, req.body.date || curVals.date, req.body.lbs || curVals.unit, Number(req.body.id)],
                    function (err, result) {
                        if (err) {
                            next(err);
                            return;
                        }
                        res.render('home');
                    });
            }
        })
    }

    if (req.body.submit === 'all'){
        mysql.pool.query('SELECT * FROM workout2', function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            context.results = rows;
            var num = context.results.length
            for (var i = 0; i < num; i++) {
                var d = context.results[i].date
                var month = d.getMonth() + 1
                var day = d.getDate()
                var year = d.getFullYear()
                d = [month, day, year].join('-');
                context.results[i].date = d
            }
            res.send(context)
        })
    }

    if (req.body.Delete === 'Delete'){
        mysql.pool.query("DELETE FROM workout2 WHERE id=?", [req.body.id], function (err, result){
            if(err){
                next(err);
                return;
            }
            res.send();
        });
    }

    if (req.body.submit === ''){
        var n = req.body.name
        var r = req.body.reps
        var w = req.body.weight
        var d = req.body.date
        var u = req.body.lbs
        mysql.pool.query("INSERT INTO workout2 (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [n, r, w, d, u], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            mysql.pool.query('SELECT * FROM workout2', function (err, rows, fields) {
                if (err) {
                    next(err);
                    return;
                }
                context.results = rows;
                /*
                var num = context.results.length
                for (var i = 0; i < num; i++) {
                    var d = context.results[i].date
                    var month = d.getMonth() + 1
                    var day = d.getDate()
                    var year = d.getFullYear()
                    d = [month, day, year].join('-');
                    context.results[i].date = d
                }

                 */
                res.send(context)
            })
        })}
})


app.get('/reset-table',function(req,res,next){
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS workout2", function(err){ //replace your connection pool with the your variable containing the connection pool
        var createString = "CREATE TABLE workout2("+
            "id INT PRIMARY KEY AUTO_INCREMENT,"+
            "name VARCHAR(255) NOT NULL,"+
            "reps INT,"+
            "weight INT,"+
            "date DATE,"+
            "lbs BOOLEAN)";
        mysql.pool.query(createString, function(err){
            context.results = "Table reset";
            res.render('home',context);
        })
    });
});

app.get('/edit', function (req,res,next) {
    var context = {};
    mysql.pool.query("SELECT * FROM workout2 WHERE id=?", [req.query.id], function (err, result) {
        if (err) {
            next(err);
            return;
        }
        context.results = result;
        var d = context.results[0].date
        var month = d.getMonth()+1
        if (month<10){
            month = ('0' + month).slice(-2)
        }
        var day = d.getDate()
        if (day<10){
            day = ('0' + day).slice(-2)
        }
        var year = d.getFullYear()
        d = [year, month, day].join('-');
        context.results[0].date = d

        res.render('edit', context);
    })
})

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

