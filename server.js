'use strict';

const express = require('express');
const axios = require('axios');
const cors = require('cors')
const { expressjwt: jwt } = require('express-jwt');
const jwtCheck = require('./middleware/jwt-check');
require('dotenv').config();
const mongoose = require('mongoose');

// Bring in the User model
const User = require('./models/user.js');
let currentUserSub = null;

// Connect Mongoose to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION);

// Open connection to MongoDB using Mongoose.
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('Mongoose is now connected.'));

// Create Express server.
const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Coin Fellows')
})

app.get('/user', jwtCheck, getUser)

async function getUser(req, res, next) {
  try {
  const userDoc = await User.findOneAndUpdate(
    { _id: req.auth.sub },
    { watchlist: ['bitcoin'] },
    { upsert: true, new: true }
  )
  currentUserSub = req.auth.sub;
  res.status(200).send(userDoc)
  } catch (error) {
    next(error);
  }
}

app.get('/market', getMarketData)

async function getMarketData(req, res, next) {
  try {
  const baseUrl = 'https://api.coingecko.com/api/v3/coins/markets'

  const params = {
    vs_currency: 'USD',
    per_page: 20,
  }
  const apiResponse = await axios.get(baseUrl, { params });
  const marketData = apiResponse.data;
  const user = await User.findById(currentUserSub, 'watchlist').exec();
  const returnedData = marketData.map(element => {
    return new CoinMarketData(element, (user.watchlist.some(coin => coin === element.id)))
  }
  )
  res.status(200).send(returnedData);
  } catch (error) {
    next(error);
  }
}

class CoinMarketData {
  constructor(marketObj, isFavorited) {
    this.id = marketObj.id;
    this.name = marketObj.name;
    this.symbol = marketObj.symbol;
    this.image = marketObj.image;
    this.rank = marketObj.market_cap_rank;
    this.percentage_change_24h = marketObj.price_change_percentage_24h;
    this.marketCap = marketObj.market_cap;
    this.current_price = marketObj.current_price;
    this.isFavorited = isFavorited;
  }
}

app.listen(port);