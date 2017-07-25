var express = require('express'); 
var bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser');
var path = require('path'); 
var expressValidator = require('express-validator'); 
var session = require('express-session'); 
var mongojs = require('mongojs'); 

var db = mongojs('Bizent', ['CareerFair', 'Colleagues', 'Family', 'Friends', 'PotentialPartners']);

var ObjectID = mongojs.ObjectID;   
var app = express(); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); 

app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.get('/',function(req,res){
    var colleagues = [];
    var family = [];
    var careerFair = []; 
    var potentialPartners = []; 
    db.CareerFair.find({},function(err,docs){
        careerFair = docs.slice();
    });
    db.Family.find({},function(err,docs){
        family = docs.slice();
    });
    db.Colleagues.find({},function(err,docs){
        colleagues = docs.slice();
    });
    db.PotentialPartners.find({},function(err,docs){
        potentialPartners = docs.slice();
    });
    db.Friends.find({},function(err,docs){
        res.render('main',{
            db: db, 
            colleagues: colleagues,
            family: family,
            careerFair: careerFair,
            friends: docs,
            potentialPartners: potentialPartners
        });
    });
});

app.get('/aboutme',function(req,res){
    res.render('aboutme');
})


app.listen(8080,function(){
    console.log('Listening on port 8080'); 
})