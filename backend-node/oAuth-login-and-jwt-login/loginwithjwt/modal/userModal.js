var mongoose = require('mongoose');

//what kind of fields will be there in collections
var UserSchema  = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:String
})
//mongoose.model('collection','schema)
mongoose.model('user',UserSchema);
module.exports = mongoose.model('user');