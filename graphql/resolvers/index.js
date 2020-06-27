//Requires from the project
const authResolver = require('./user');
const postsResolver = require('./posts');
const categoriesResolver = require('./category');
const RacesResolver = require('./race');

const rootResolver = {
    ...authResolver,
    ...postsResolver,
    ...categoriesResolver,
    ...RacesResolver,
}

module.exports = rootResolver;