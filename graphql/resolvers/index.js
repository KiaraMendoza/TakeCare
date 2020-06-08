const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const events = (eventIds) => {
    return Event.find({ _id: { $in: eventIds } })
        .then(events => {
            return events.map(event => {
                return { ...event._doc, date: new Date(event._doc.date).toISOString(), creator: user.bind(this, event.creator) }
            })
        })
        .catch(err => { throw err; })
}

const user = (userId) => {
    return User.findById(userId)
        .then(user => {
            return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents) };
        })
        .catch(err => { throw err });
}

module.exports = {
    // query for all events
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return { ...event._doc, date: new Date(event._doc.date).toISOString(), creator: user.bind(this, event._doc.creator) }
                })
            })
            .catch(err => {
                throw err;
            });
    },
    // mutation for create events
    createEvent: args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5eddf37b06f6ee19201ec96c'
        })
        let createdEvent;
        return event.save()
            .then(result => {
                createdEvent = { ...result._doc, date: new Date(event._doc.date).toISOString(), creator: user.bind(this, result._doc.creator) }
                return User.findById('5eddf37b06f6ee19201ec96c');
            })
            .then(user => {
                if (!user) {
                    throw new Error('User doesn\'t exist.')
                }
                console.log(createdEvent.creator)
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result => {
                return createdEvent;
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    },
    //mutation for create users, using bcrypt to encrypt the password
    createUser: args => {
        return User.findOne({ email: args.userInput.email })
            .then(user => {
                if (user) {
                    throw new Error('User exists already.')
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            .then(hashedPassword => {
                const user = new User({
                    username: args.userInput.username,
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save();
            })
            .then(result => {
                return { ...result._doc, password: null };
            })
            .catch(err => { throw err });
    }
}