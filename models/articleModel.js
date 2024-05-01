const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  // author: { type: mongoose.SchemaTypes.ObjectId },
  author: { type: String },
  title: { type: String },
  body: { type: String },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Articles", articleSchema);
