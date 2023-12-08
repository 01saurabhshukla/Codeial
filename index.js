const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const port = 8000;
const db = require('./config/mongoose');

app.use(express.static("./assets"));

app.use(expressLayouts);
// extract style and script from sub pages into layout
app.set("layout extractStyles",true);
app.set("layout extractScripts",true);

// This one should load before server starts
// using express routers
app.use("/", require("./routes"));

// set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(port, function (err) {
  if (err) {
    console.log(`Error: ${err}`);
  }

  console.log(`Server is Running at Port : ${port}`);
});
