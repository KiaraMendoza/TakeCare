//Requires from the project
const Category = require('../../models/category');

module.exports = {
    //query for all categories
    categories: async () => {
        try {
            const categories = await Category.find();
            return categories.map(category => {
                return category;
            })
        } catch (err) {
            throw err;
        }
    },
    //mutation for create categories
    createCategory: async (args, req) => {
        if (!req.isAuth && !req.userRol === 'Admin') {
            throw new Error('You don\'t have permission to do that');
        }
        const category = new Category({
            name: args.categoryInput.name,
            description: args.categoryInput.description,
            icon: args.categoryInput.icon,
        });
        console.log(`category back-end: ${category}`)
        try {
            const result = await category.save();
            return category;
        } catch (err) {
            throw err;
        }
    },
}