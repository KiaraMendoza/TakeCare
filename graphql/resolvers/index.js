//Requires from the project
const authResolver = require('./user');
const postsResolver = require('./posts');
const categoriesResolver = require('./category');

const rootResolver = {
    ...authResolver,
    ...postsResolver,
    ...categoriesResolver,
}

module.exports = rootResolver;