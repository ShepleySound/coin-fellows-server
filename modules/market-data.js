const axios = require('axios');
const cache = require('./cache.js').cache;
const CoinMarketData = require('../helpers/market-data-class')
const User = require('../models/user.js');

// Retrieve market data from coingecko API and sprinkle with user data.
async function getMarketData(req, res, next) {
  try {
    const currentUserSub = await req.auth.sub;
    const baseUrl = 'https://api.coingecko.com/api/v3/coins/markets'

    const params = {
      vs_currency: 'USD',
      per_page: 20,
    }
    const key = 'fullMarketSearch';

    if (cache.isCached(key) && !cache.isExpired(key)) {
      const returnedData = cache.get(key).data;
      console.log("THIS IS CACHE")
      res.status(200).send(returnedData)
    } else {
      console.log("THIS IS NOT CACHE")
      const apiResponse = await axios.get(baseUrl, { params });
      // Use data property from response.
      const marketData = apiResponse.data;
      // Get user and their watchlist to enchance response.
      const user = await User.findById(currentUserSub, 'watchlist').exec();
      const returnedData = marketData.map(element => {
        return new CoinMarketData(element, (user.watchlist.some(coin => coin === element.id)))
      })

      // Set in cache
      cache.set(key, returnedData)
      // Return data to client
      res.status(200).send(returnedData);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = getMarketData;