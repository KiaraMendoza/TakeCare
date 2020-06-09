//Requires from the project
const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
    //query for all bookings
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('You don\'t have permission to do that');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            })
        } catch (err) {
            throw err;
        }
    },
    //mutation for add bookings
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('You don\'t have permission to do that');
        }
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformEvent(result);
    },
    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('You don\'t have permission to do that');
        }
        try {
            const selectedBooking = await Booking.findById(args.bookingId).populate('event');
            const bookedEvent = transformEvent(selectedBooking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return bookedEvent;
        } catch (err) {
            throw err;
        }
    }
}