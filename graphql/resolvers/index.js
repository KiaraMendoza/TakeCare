//Requires from the project
const authResolver = require('./user');
const eventsResolver = require('./events');
const bookingResolver = require('./booking');
const postsResolver = require('./posts');

const rootResolver = {
    ...authResolver,
    ...eventsResolver,
    ...bookingResolver,
    ...postsResolver
}

module.exports = rootResolver;