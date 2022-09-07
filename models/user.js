const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  _id: { type: String, required: true },
  watchlist: [String],
})

const User = mongoose.model('User', userSchema);

module.exports = User;