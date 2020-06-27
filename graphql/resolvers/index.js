//Requires from the project
const authResolver = require('./user');
const postsResolver = require('./posts');
const categoriesResolver = require('./category');
const racesResolver = require('./race');
const commentResolver = require('./comment');

const rootResolver = {
    ...authResolver,
    ...postsResolver,
    ...categoriesResolver,
    ...racesResolver,
    ...commentResolver,
}

module.exports = rootResolver;