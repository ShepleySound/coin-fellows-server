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

    const key = `${currentUserSub}watchlist`;
    if (cache.isCached(key) && !cache.isExpired(key)) {
      const returnedData = cache.get(key).data;
      res.status(200).send(returnedData);
    } else {
      const params = {
        vs_currency: 'USD',
        ids: watchlist.join(',')
      }
      const apiResponse = await axios.get(baseUrl, { params });
      // Use data property from response.
      const watchlistData = apiResponse.data;
      const returnedData = watchlistData.map(element => {
        return new CoinMarketData(element, true);
      })
      // Set in cache
      cache.set(key, returnedData)
      // Return data to client
      res.status(200).send(returnedData);
    }
  
  } catch (error) {
    next(error)
  }
}

module.exports = getWatchlist;