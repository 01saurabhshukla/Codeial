const express = require('express');
const app = express();
const port = 8000;

// This one should load before server starts
// using express routers
app.use('/', require('./routes'));


app.listen(port,function(err){
    if(err){
        console.log(`Error: ${err}`);
    }

    console.log(`Server is Running at Port : ${port}`);
});