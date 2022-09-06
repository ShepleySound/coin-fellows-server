'use strict';

const express = require('express');
const cors = require('cors')
const { expressjwt: jwt } = require('express-jwt');
const jwtCheck = require('./middleware/jwt-check');
require('dotenv').config();
const mongoose = require('mongoose');

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

app.get('/protected', jwtCheck, getUser)

async function getUser(req, res, next) {
  try {
  console.log('REQ', req.auth.sub)
  const userDoc = await User.findOneAndUpdate(
    { _id: req.auth.sub },
    { name: req.auth.sub },
    { upsert: true, new: true }
  )
  res.status(200).send(userDoc)
  } catch (error) {
    next(error);
  }
}

app.get('/authorized', (req, res) => {
  res.send('Secured Resource');
})

app.get('')

app.listen(port);