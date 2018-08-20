const config = require('config');
const mongoose = require('mongoose');
module.exports=function(){
    const dbUrl = config.get('database.url');
    mongoose.connect(dbUrl,{ useNewUrlParser: true }); 
}