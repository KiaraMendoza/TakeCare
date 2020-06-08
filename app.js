//Requires from node_modules
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
//Requires from the project
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
//MongoDB variables connections
const url = 'mongodb://127.0.0.1:27017/merngql';
const app = express();
//MongoDB connection
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', _ => {
    console.log('Database connected:', url)
})

db.on('error', err => {
    console.error('Connection error:', err)
})

app.use(bodyParser.json());

//GraphQl work
app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));

app.listen(3000);

/* Example of mutation's query */

/* Create Event
mutation {
  createEvent(eventInput: {
    title: "Kissing Oriol",
    description: "Kissing Oriol all the Night and maybe something else",
    price: 1.5,
    date: "2020-06-03"
  }) {
    title
    description
    creator {
        username
    }
  }
} 
*/

/* Create User
mutation {
  createUser(userInput: {
    username: "kiara",
    email: "kiara@test.com",
    password: "kiara1234"
  }) {
    username
    email
  }
}
*/

/* Example of query */

/*
query {
  events {
    date
    title
    creator {
      username
      email
    }
  }
}
*/