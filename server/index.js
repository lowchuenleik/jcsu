const express = require('express');
const routes =  require('./routes/index');
const newsRoute = require('./routes/news');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv').config();
const cors = require('cors');
const multer = require('multer');

var RavenStrategy = require('passport-raven');
var session = require('cookie-session');
var passport = require('passport');
var Raven = require('passport-raven');
var morgan = require('morgan');

let app = express();

const PORT = process.env.PORT || 5000;
const dbURL = process.env.MONGO_DB_URL;

const authCheckMiddleware = require('./middleware/authCheck');
const testMid = require('./middleware/testMid');

console.log("Connecting to Database at ....");
console.log(dbURL);

mongoose.connect(dbURL, {useNewUrlParser:true}, function (err) {
    if (err) {
        console.log('Error connecting to: ' + dbURL)
        console.log(err)
    } else {
        console.log('Connected to: ' + dbURL)
    }
}).then(r =>{console.log("End of connection process..\n")})

app.use(cors());
app.options('*', cors());

app.use(function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next(); 
}); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

//Raven authentication for students of cambridge university
passport.use(new Raven({
  audience: process.argv[2] || 'http://localhost:5000',
  desc: 'JCSU Grid of Faces 2019',
  msg: 'Enter your raven login details please',
  debug: false//process.env.NODE_ENV !== 'production'
}, function (crsid, response, callback) {
  console.dir(response);
  console.log('Login with crsid: ' + crsid);
  callback(null, {crsid: crsid, isCurrent: response.isCurrent});
}));

passport.serializeUser(function(user, done) {
  console.log("LOOK HERE OMG",user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(morgan('dev'));
app.use(session({
  maxAge: '1 month',
  keys: ['Some Secret String'],
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(err, req, res, next) {
  console.log(err);
});

app.get('/ravenlogin', passport.authenticate('raven',{
  successRedirect: '/user/dashboard',
  failureRedirect: '/login'
}), function (req, res) {
  headers.append("Access-Control-Allow-Origin", "*");
  console.log("Triggered rvenlogin endpoitn");
  res.redirect('/news');
});

app.get('/testing', function (req, res) {
  if (req.isAuthenticated()) {
    res.send('Logged in as ' + req.user.crsid + ' (a ' + (req.user.isCurrent ? 'current' : 'past') + ' member of the University of Cambridge).');
  } else {
    res.send('<a href="/login">Login using Raven</a>');
  }
});

// Put all API endpoints under '/api'
app.use('/middleware', testMid);
app.get('/api/temp', (req, res) => {
  const count = 5;

  // Return them as json
  res.json({'hi':123});

  console.log(`Sent ${count} passwords`);
});

app.use('/', routes);

app.use('/news', testMid);
app.use('/news', newsRoute);

app.use('/user',authRoute);

app.use('/student',userRoute);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(PORT,function(){
    console.log(`Listening on port ${PORT}`);
})

