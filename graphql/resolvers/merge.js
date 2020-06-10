//Requires from the project
const Event = require('../../models/event');
const Post = require('../../models/post');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

//Functions for making the relations between models
const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return transformEvent(event);
        });
    }
    catch (err) {
        throw err;
    };
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (err) {
        throw err;
    };
};

const posts = async postsIds => {
    try {
        const posts = await Post.find({ _id: { $in: postsIds } });
        return posts.map(post => {
            return transformPost(post);
        });
    }
    catch (err) {
        throw err;
    };
};

const singlePost = async postId => {
    try {
        const post = await Post.findById(postId);
        return transformPost(post);
    } catch (err) {
        throw err;
    };
};

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            createdEvents: events.bind(this, user._doc.createdEvents),
            createdPosts: events.bind(this, user._doc.createdPosts)
        };
    } catch (err) {
        throw err;
    };
};

//Function for refactoring transforms
const transformEvent = event => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
};

const transformPost = post => {
    return {
        ...post._doc,
        createdAt: dateToString(post._doc.createdAt),
        updatedAt: dateToString(post._doc.updatedAt),
        creator: user.bind(this, post.creator)
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
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.transformPost = transformPost;

//exports.user = user;
//exports.events = events;
//exports.singleEvent = singleEvent;