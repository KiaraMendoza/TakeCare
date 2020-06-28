//Requires from node_modules
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const path = require('path');
//Requires from the project
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');
require('dotenv').config();
//MongoDB variables connections
//const url = 'mongodb://127.0.0.1:27017/takecare'; //For local connection
const uri = process.env.ATLAS_URI;
const app = express();
const port = process.env.PORT || 8000;
//MongoDB Local connection
//mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
//const db = mongoose.connection;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.use(bodyParser.json());

//Headers needed by the navigator to make requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
})

app.use(isAuth);

//GraphQl work
app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));

// Serve stactic assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('frontend/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
};

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});