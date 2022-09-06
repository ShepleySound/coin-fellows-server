'use strict';

const express = require('express');
const cors = require('cors')
const { expressjwt: jwt } = require('express-jwt');
const jwtCheck = require('./middleware/jwt-check');
require('dotenv').config();
const mongoose = require('mongoose');


// Connect Mongoose to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION);

const app = express();
const port = process.env.PORT || 3002;



app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Coin Fellows')
})

app.get('/protected', jwtCheck, (req, res) => {
  console.log(req)
  res.status(200).send('hello protected!!!!')
})

app.get('/authorized', (req, res) => {
  res.send('Secured Resource');
})

app.get('')

app.listen(port);