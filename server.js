'use strict';

const express = require('express');
const axios = require('axios');
const cors = require('cors')
const { expressjwt: jwt } = require('express-jwt');
const jwtCheck = require('./middleware/jwt-check');
require('dotenv').config();
const mongoose = require('mongoose');
const getWatchlist = require('./modules/watchlist');
const getMarketData = require('./modules/market-data');
const SingleCoinData = require('./helpers/coin-data-class.js');

// Bring in the User model
const User = require('./models/user.js');
const { findById } = require('./models/user.js');

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
app.delete('/user', jwtCheck, deleteFromWatchlist)
app.post('/user', jwtCheck, addToWatchList)
async function getUser(req, res, next) {
  try {
    // Adds user to the database if not found. Returns the user.
    const user = await User.findOneAndUpdate(
      { _id: req.auth.sub },
      { $setOnInsert: { watchlist: [{_id: 'bitcoin', name: 'bitcoin'}, {_id: 'ethereum', name: 'ethereum'}] }},
      { upsert: true, new: true }
    )
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
}

async function deleteFromWatchlist(req, res, next) {
  try {
    const user = await User.findById(req.auth.sub).exec();
    await user?.watchlist.id(req.body.coinId).remove();
    user.save();
    res.status(201).send("deleted")
  } catch (error) {
    next(error);
  }
}

async function addToWatchList(req, res, next) {
  try {
    const user = await User.findById(req.auth.sub).exec();
    await user?.watchlist.push({ _id: req.body.coinId, name: req.body.coinId });
    user.save();
    res.status(200).send("added")
  } catch (error) {
    next(error);
  }
}

app.get('/userdata')
app.get('/coins', coinRoot)
app.get('/coins/:coinid', populateCoin)

async function coinRoot(req, res, next) {
  try {
    res.status(200).send("hello")
  } catch (error) {
    next(error)
  }
}

async function populateCoin(req, res, next) {
  console.log(req.params.coinid)
  const coinid = req.params.coinid;
  const coinRequest = {
    params: {
      id: coinid,
      localization: false,
      tickers: false,
      community_data: false,
      developer_data: false,
    }
  }
  const ohlcRequest = {
    params: {
      id: coinid,
      vs_currency: 'usd',
      days: 30,
    }
  }
  try {
    const coinResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinid}`, coinRequest);
    console.log(coinResponse)
    const ohlcResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinid}/ohlc`, ohlcRequest);
    const returnedData = new SingleCoinData(coinResponse.data, ohlcResponse.data);
    res.status(200).send(returnedData)
  } catch (error) {
    next(error)
  }
}

// Watchlist endpoint
app.get('/watchlist', jwtCheck, getWatchlist)


// Market endpoint
app.get('/market', jwtCheck, getMarketData)

app.get('*', (req, res) => {
  res.status(404).send('Page not available.');
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send(err.message)
})


app.listen(port);