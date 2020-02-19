var mongoose = require("mongoose");

var DinosurSchema = new mongoose.Schema({
  name: String,
  age: Number,
  family: String,
  food: String,
  image: String,
  content : String
});

var Book = mongoose.model("Book", DinosurSchema);
module.exports = Book;
