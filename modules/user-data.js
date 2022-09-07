// const axios = require('axios');
// const cache = require('./cache.js').cache;
const User = require('../models/user.js');


async function getUserData(req, res, next) {
  const currentUserSub = await req.auth.sub;
  const user = await User.findById(currentUserSub, 'watchlist').exec();
}

// async function updateUserData(req, res, next) {

// }


  
module.exports = getUserData;