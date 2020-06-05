const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

const url = 'mongodb://127.0.0.1:27017/merngql';
const app = express();


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', _ => {
    console.log('Database connected:', url)
})

db.on('error', err => {
    console.error('connection error:', err)
})

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        // query for all events
        events: () => {
            return Event.find()
            .then(events => {
                return events;
            })
            .catch(err => {
                throw err;
            });
        },
        // mutation for create events
        createEvent: (args) => {
            /* const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date // new Date().toISOString()
            } */
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            return event.save()
            .then(result => {
                console.log(result);
                return result;
            })
            .catch(err => {
                console.log(err);
            });
            return event;
        }
    }, //resolver
    graphiql: true
}));

app.listen(3000);

/* Example of mutation's query */

/* 
mutation {
  createEvent(eventInput: {
    title: "Kissing Oriol",
    description: "Kissing Oriol all the Night and maybe something else",
    price: 1.5,
    date: "2020-06-03"
  }) {
    title
    description
  }
} 
*/

/* Example of query */

/*
query {
    events {
        title,
        _id
    }
}
*/