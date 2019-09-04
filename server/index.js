const express = require('express');
const routes =  require('./routes/index');
const newsRoute = require('./routes/news');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const customAuthRoutes = require('./routes/customauth');

const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

var session = require('cookie-session');
var passport = require('passport');
var Raven = require('passport-raven');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');

//Declarations and ports
const PORT = process.env.PORT || 5000;
const dbURL = process.env.MONGO_DB_URL;

let raven_passport_url = undefined;
let redirect_url = undefined;

const env = process.env.NODE_ENV || "development";
switch (env) {
    case 'development':
        raven_passport_url = 'http://localhost:5000';
        redirect_url = 'http://localhost:3000';
        break;
    case 'production':
        raven_passport_url = "https://jcsu.herokuapp.com";
        redirect_url = "https://jcsu.herokuapp.com";
    default:
        break
}

//Middleware
const ravenAuth = require('./middleware/ravenAuth');
const authCheckMiddleware = require('./middleware/authCheck');
const testMid = require('./middleware/testMid');

let app = express();

console.log("LOOK HERE FOR PROCESS URL?",process.argv[2]);


// Database stuff
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


// Headers and whatnot
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
  audience: raven_passport_url,
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

// Making all errors log, more a testing/dev feature.
app.use(function(err, req, res, next) {
  console.log(err);
});

// Passport auth endpoint checking if authenticated
app.get('/ravenlogin', passport.authenticate('raven'), function (req, res) {
  console.log("Triggered ravenlogin endpoint!");
  res.redirect(redirect_url+'/?loggedin=true');
});

// Called by main page to retrieve signed token.
app.get('/api/authenticate', function(req, res) {
  const { email, password } = req.body;
  console.log("hit api auth, following is if auth or not",req.isAuthenticated());
  if (req.isAuthenticated()){
      var authToken = jwt.sign({username: req.user.crsid}, process.env.JWTSECRET,{ expiresIn: '10h' });
      res.status(200).json({hi:"bye",token:authToken})
  } else{
      console.log("NOT AUTHENTICATED");
      res.status(401).send({error: 'Please log in again, session expired.'})
  }
});

// Testing routes
app.get('/testing', function (req, res) {
  if (req.isAuthenticated()) {
    res.send('Logged in as ' + req.user.crsid + ' (a ' + (req.user.isCurrent ? 'current' : 'past') + ' member of the University of Cambridge).');
  } else {
    res.send('<a href="/ravenlogin">Login using Raven</a>');
  }
});

app.use('/middleware', testMid);

app.get('/api/temp', (req, res) => {
  const count = 5;

  // Return them as json
  res.json({'hi':123});

  console.log(`Sent ${count} passwords`);
});

// Main router routes - note that they are matched in order listed here.
app.use('/', routes);

app.use('/auth', ravenAuth); //Applying middleware
app.use('/auth', customAuthRoutes);

app.use('/news', testMid); //Applying middleware
app.use('/news', newsRoute);

app.use('/user',authRoute);
app.use('/student',userRoute);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// Set port of application.
app.listen(PORT,function(){
    console.log(`Listening on port ${PORT}`);
});