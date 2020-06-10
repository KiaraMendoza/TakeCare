//Requires from the project
const authResolver = require('./user');
const postsResolver = require('./posts');

const rootResolver = {
    ...authResolver,
    ...postsResolver
}

module.exports = rootResolver;