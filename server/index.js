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

let app = express();

const PORT = process.env.PORT || 5000;
const dbURL = process.env.MONGO_DB_URL;

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


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/api/temp', (req, res) => {
  const count = 5;

  // Return them as json
  res.json({'hi':123});

  console.log(`Sent ${count} passwords`);
});

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/', routes);

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

