'use strict';

const express = require('express');
const axios = require('axios');
const cors = require('cors')
const { expressjwt: jwt } = require('express-jwt');
const jwtCheck = require('./middleware/jwt-check');
require('dotenv').config();
const mongoose = require('mongoose');
const getWatchlist = require('./modules/watchlist')
const getMarketData = require('./modules/market-data')

// Bring in the User model
const User = require('./models/user.js');

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
// Maybe make this a different route? /:id
async function getUser(req, res, next) {
  try {
  await User.updateOne(
    { _id: req.auth.sub },
    { $setOnInsert: { _id: req.auth.sub, watchlist: ['bitcoin'] }},
    { upsert: true, new: true }
  )
  } catch (error) {
    next(error);
  }
}

// Watchlist endpoint
app.get('/watchlist', jwtCheck, getWatchlist)

// Market endpoint
app.get('/market', jwtCheck, getMarketData)

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send(err.message)
})


app.listen(port);