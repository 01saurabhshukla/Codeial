const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require('cookie-parser');
const port = 8000;
const db = require('./config/mongoose');

// used for session cookies
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');

// const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');



app.use(express.urlencoded({extended: true}));

// Here i have removed express.cookieParser()
app.use(cookieParser());

app.use(express.static("./assets"));
// make the uploads path available to the server to show profiel pictures
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(expressLayouts);

// extract style and script from sub pages into layout
app.set("layout extractStyles",true);
app.set("layout extractScripts",true);


// set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");





// order matters
// mongostore is used to store session cookie in db
app.use(
  session({
  name: 'codeial',

  // TO DO Change before deploying on production
  secret: 'blahsomething',

  // with its help amazon stores data without even logging
  saveUninitialized: false,

  // this used in preventing data to store again and again since it stores updated data
  resave: false,
  cookie: {
    maxAge: (1000*60*100)
  },
  store: MongoStore.create(
    {
    mongoUrl: 'mongodb://0.0.0.0/codeial_development',
    autoRemove: 'disabled'
    },
    function(err){
      console.log(err || 'connect-mongoDB setup okay');
    }

    
  )
}));



app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// This one should load before server starts
// using express routers
app.use("/", require("./routes"));



app.listen(port, function (err) {
  if (err) {
    console.log(`Error: ${err}`);
  }
  console.log(`Server is Running at Port : ${port}`);
});
