const axios = require('axios');
const cache = require('./cache.js').cache;
const CoinMarketData = require('../helpers/market-data-class')
const User = require('../models/user.js');


async function getWatchlist(req, res, next) {
  try {
    const currentUserSub = await req.auth.sub;
    const user = await User.findById(currentUserSub, 'watchlist').exec();
    const watchlist = user.watchlist;
    const baseUrl = 'https://api.coingecko.com/api/v3/coins/markets'
    const watchlistString = watchlist.map(item => {
      return item._id;
    }).join(',')
    const params = {
      per_page: 0,
      vs_currency: 'USD',
      ids: watchlistString
    }
    const apiResponse = await axios.get(baseUrl, { params });
    // Use data property from response.
    const watchlistData = apiResponse.data;
    const returnedData = watchlistData.map(element => {
      return new CoinMarketData(element);
    })
    res.status(200).send(returnedData);

    // Return data to client
  
  } catch (error) {
    next(error)
  }
}

module.exports = getWatchlist;