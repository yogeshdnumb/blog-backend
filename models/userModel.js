const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String },
  password: { type: String },
  refreshToken: { type: String },
  roles: [String],

});

module.exports = mongoose.model("Users", userSchema);
