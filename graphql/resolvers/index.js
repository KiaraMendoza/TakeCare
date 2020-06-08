//Requires from node_modules
const bcrypt = require('bcryptjs');
//Requires from the project
const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const { dateToString } = require('../../helpers/date');

//Function for refactoring event's transforms
const transformEvent = event => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
};

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

//Functions for making the relations between models
const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return transformEvent(event);
        });
    }
    catch(err) {
        throw err;
    };
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch(err) {
        throw err;
    };
};

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return { 
            ...user._doc, 
            createdEvents: events.bind(this, user._doc.createdEvents) 
        };
    } catch(err) {
        throw err;
    };  
};

module.exports = {
    //query for all events
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            })
        } catch(err) {
            throw err;
        }
    },
    //query for all bookings
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                transformBooking(booking);
            })
        } catch (err) {
            throw err;
        }
    },
    //mutation for create events
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
            createdEvent = transformEvent(result);
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
    },
    //mutation for add bookings
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: '5eddf37b06f6ee19201ec96c',
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformEvent(result);
    },
    cancelBooking: async args => {
        try {
            const selectedBooking = await Booking.findById(args.bookingId).populate('event');
            const bookedEvent = transformEvent(selectedBooking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return bookedEvent;
        } catch(err) {
            throw err;
        }
    }
}