const mongoose = require('mongoose');

const { Schema } = mongoose;

const watchItemSchema = new Schema({
  _id: {type: String, required: true},
  name : {type: String, required: true}
})
const ownedItemSchema = new Schema({
  _id: {type: String, required: true},
  name: {type: String, required: true},
  qty: {type: Number, required: true},
})
const userSchema = new Schema({
  _id: { type: String, required: true },
  watchlist: [watchItemSchema],
  owned: [ownedItemSchema],
})

module.exports = mongoose.models.User || mongoose.model('User', userSchema);