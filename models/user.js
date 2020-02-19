var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserScheme = new mongoose.Schema({
    username  : String,
    password  : String
});

// take local pakage and add to user schema
UserScheme.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserScheme);