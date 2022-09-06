'use strict';

const express = require('express');
const cors = require('cors')
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;


const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Coin Fellows')
})

app.get('/protected', jwtCheck, (req, res) => {
  res.status(200).send('hello protected!!!!')
})

app.get('/authorized', (req, res) => {
  res.send('Secured Resource');
})

app.get('')

app.listen(port);