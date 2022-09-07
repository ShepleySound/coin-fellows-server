const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  _id: { type: String, required: true },
  watchlist: [String],
})

module.exports = mongoose.models.User || mongoose.model('User', userSchema);