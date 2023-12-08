const mongoose = require('mongoose');

mongoose.connect('mongodb://0.0.0.0/codeial_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console,'Error Connecting to DB'));

db.once('open',function(){
    console.log('Connected to database :: MongoDB');
});

module.exports = db;