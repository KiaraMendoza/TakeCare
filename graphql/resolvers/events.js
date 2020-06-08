//Requires from the project
const Event = require('../../models/event');
const { transformEvent } = require('./merge');

module.exports = {
    //query for all events
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            })
        } catch (err) {
            throw err;
        }
    },
    //mutation for create events
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5eddf37b06f6ee19201ec96c'
        });
        let createdEvent;
        try {
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
};