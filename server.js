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
    user.watchlist.id(req.body.coinId).remove();
    user.save();
    res.status(201).send("deleted")
  } catch (error) {
    next(error);
  }
}

async function addToWatchList(req, res, next) {
  try {
    const user = await User.findById(req.auth.sub).exec();
    user.watchlist.push({ _id: req.body.coinId, name: req.body.coinId });
    user.save();
    res.status(200).send("added")
  } catch (error) {
    next(error);
  }
}

app.get('/userdata')

// Watchlist endpoint
app.get('/watchlist', jwtCheck, getWatchlist)


// Market endpoint
app.get('/market', jwtCheck, getMarketData)

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send(err.message)
})


app.listen(port);