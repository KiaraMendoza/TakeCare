//Requires from the project
const Category = require('../../models/category');
const Post = require('../../models/post');

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
    categoryData: async (args) => {
        try {
            const categories = await Category.find();
            const matchedCategory = categories.find(category =>
                category.name == args.name);
            // const posts = await Post.find();
            // const matchedPosts = posts.filter(post => post.category.name == args.name);
            return matchedCategory;
        } catch (err) {
            throw err;
        }
    },
    //mutation for create categories
    createCategory: async (args, req) => {
        if (!req.isAuth && !req.userRol === 'Admin') {
            throw new Error('You don\'t have permission to do that');
        }
        const categories = await Category.find();
        const existingCategory = await Category.findOne({ name: args.CategoryInput.name });

        if (existingCategory) {
            throw new Error('Category exists already.');
        }

        const category = new Category({
            name: args.categoryInput.name,
            description: args.categoryInput.description,
            icon: args.categoryInput.icon,
        });
        try {
            const result = await category.save();
            return category;
        } catch (err) {
            throw err;
        }
    },
}