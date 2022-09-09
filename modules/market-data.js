const axios = require('axios');
const cache = require('./cache.js').cache;
const CoinMarketData = require('../helpers/market-data-class')


// Retrieve market data from coingecko API and sprinkle with user data.
async function getMarketData(req, res, next) {
  try {
    const baseUrl = 'https://api.coingecko.com/api/v3/coins/markets'

    const params = {
      vs_currency: 'USD',
      per_page: 50,
    }

    const key = 'fullMarketSearch';

    if (cache.isCached(key) && !cache.isExpired(key)) {
      const returnedData = cache.get(key).data;
      res.status(200).send(returnedData)
    } else {
      const apiResponse = await axios.get(baseUrl, { params });
      // Use data property from response.
      const marketData = apiResponse.data;
      const returnedData = marketData.map(element => {
        return new CoinMarketData(element)
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