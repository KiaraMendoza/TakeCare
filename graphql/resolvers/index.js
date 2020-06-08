const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        events.map(event => {
            return { ...event._doc, date: new Date(event._doc.date).toISOString(), creator: user.bind(this, event.creator) }
        });
        return events;
    }
    catch(err) {
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents) };
    } catch(err) {
        throw err;
    }
        
}

module.exports = {
    // query for all events
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return { ...event._doc, date: new Date(event._doc.date).toISOString(), creator: user.bind(this, event._doc.creator) }
            })
        } catch(err) {
            throw err;
        }
    },
    // mutation for create events
    createEvent: async args => {
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5eddf37b06f6ee19201ec96c'
            })
            let createdEvent;
            const result = await event.save();
            createdEvent = { ...result._doc, date: new Date(event._doc.date).toISOString(), creator: user.bind(this, result._doc.creator) }
            const creator = await User.findById('5eddf37b06f6ee19201ec96c');
            if (!creator) {
                throw new Error('User not found.')
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch (err) {
            throw err;
        }
    },
    //mutation for create users, using bcrypt to encrypt the password
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email })
            if (existingUser) {
                throw new Error('User exists already.')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                username: args.userInput.username,
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = await user.save();
            return { ...result._doc, password: null };
        } catch (err) {
            throw err;
        }
    }
}