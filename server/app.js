const express = require('express');
const routes =  require('./routes/index');
const newsRoute = require('./routes/news');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const cors = require('cors');

let app = express();

const PORT = process.env.PORT || 5000;
const dbURL = process.env.MONGO_DB_URL;


console.log("DB URL");
console.log(dbURL);

mongoose.connect(dbURL, {useNewUrlParser:true}, function (err) {
    if (err) {
        console.log('Error connecting to: ' + dbURL)
        console.log(err)
    } else {
        console.log('Connected to: ' + dbURL)
    }
}).then(r =>{console.log("HO")})

app.use(cors());
app.options('*', cors());

app.use(cors());
app.options('*',cors());

app.use('/', routes);

app.use('/news', newsRoute);

app.listen(PORT,function(){
    console.log(`Listening on port ${PORT}`);
})