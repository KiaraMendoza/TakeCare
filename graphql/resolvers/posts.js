//Requires from the project
const Post = require('../../models/post');
const Comment = require('../../models/comment');
const Category = require('../../models/category');
const Race = require('../../models/race');
const User = require('../../models/user'); 
const { transformPost, transformUpdatedPost } = require('./merge');
const {filterArray} = require('../../helpers/filterArray');

module.exports = {
    //query for all posts
    posts: async () => {
        try {
            const posts = await Post.find();
            return posts.map(post => {
                return transformPost(post);
            })
        } catch (err) {
            throw err;
        }
    },
    postData: async (postId) => {
        try {
            const post = await Post.findById(postId);
            let result = transformPost(post);
            console.log(result)
            return result;
        } catch (err) {
            throw err;
        }
    },
    //mutation for create posts
    createPost: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('You don\'t have permission to do that');
        }
        const post = new Post({
            title: args.postInput.title,
            description: args.postInput.description,
            imageUrl: args.postInput.imageUrl,
            category: args.postInput.category,
            race: args.postInput.race,
            creator: req.userId
        });
        let createdPost;
        try {
            const result = await post.save();
            createdPost = transformPost(result);

            //Save post data on creator/user info
            const creator = await User.findById(req.userId);
            if (!creator) {
                throw new Error('User not found.')
            }
            creator.createdPosts.push(post);
            await creator.save();

            //Save post data on category info
            const category = await Category.findById(post.category);
            if (!category) {
                throw new Error('Category not found.')
            }
            category.posts.push(post);
            await category.save();

            //Save posts data on race info
            const race = await Race.findById(post.race);
            if (!race) {
                throw new Error('Race not found.')
            }
            race.posts.push(post);
            await race.save();

            return createdPost;
        } catch (err) {
            throw err;
        }
    },
    updatePost: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('You don\'t have permission to do that');
        }
        const post = await Post.findById(args._id);
        if (!post) {
            throw new Error(`Couldn't find post with id ${args._id}`);
        }
        let updatedPost = transformUpdatedPost(post, args);
        
        console.log(`post.category: ${post.category}, updatedPost: ${args.category}, ${post.category == args.category}`)
        // If we are changing post category, we need to change them in category's posts array too.
        if (args.category != post.category){
            // Find the old category doc and filtering the post we are updating
            const oldCategory = await Category.findById(post.category);
            const updatedCategoryPosts = filterArray(args._id, oldCategory.posts);
            
            await Category.update({ _id: post.category }, { posts: updatedCategoryPosts ? updatedCategoryPosts : [] });

            // Find the new category doc and adding the post
            const category = await Category.findById(args.category);
            if (!category) {
                throw new Error('Category not found.');
            }
            category.posts.push(updatedPost._id);
            await category.save();
        }

        // The same as above but with race.
        if (args.race != post.race) {
            // Find the old race doc and filtering the post we are updating
            const oldRace = await Race.findById(post.race);
            const updatedRacePosts = filterArray(args._id, oldRace.posts);

            await Race.update({ _id: post.race }, { posts: updatedRacePosts ? updatedRacePosts : [] });

            // Find the new race doc and adding the post
            const race = await Race.findById(args.race);
            if (!race) {
                throw new Error('Race not found.');
            }
            race.posts.push(updatedPost._id);
            await race.save();
        }
        
        try {
            let result = await Post.findByIdAndUpdate(args._id, updatedPost);
            return updatedPost;
        } catch (err) {
            throw err;
        }
    },
    deletePost: async (args, req, res) => {
        if (!req.isAuth) {
            throw new Error('You don\'t have permission to do that');
        }
        
        const getPostToDelete = await Post.findById(args._id);
        const creator = await User.findById(getPostToDelete.creator);
        const category = await Category.findById(getPostToDelete.category);
        const race = await Race.findById(getPostToDelete.race);
        
        //User posts update
        const updatedCreatorPosts = filterArray(args._id, creator.createdPosts);

        await User.update({ _id: getPostToDelete.creator }, { createdPosts: updatedCreatorPosts ? updatedCreatorPosts : []});

        //Category posts update
        const updatedCategoryPosts = filterArray(args._id, category.posts)

        await Category.update({ _id: getPostToDelete.category }, { posts: updatedCategoryPosts ? updatedCategoryPosts : [] });

        //Race posts update
        const updatedRacePosts = filterArray(args._id, race.posts);

        await Race.update({ _id: getPostToDelete.race }, { posts: updatedRacePosts ? updatedRacePosts : [] });

        try {
            // const deletePostOnCreator = await remove(creator.createdPosts, args._id);
            const deletedPost = await Post.findByIdAndDelete(args._id);
            // console.log(`deletedPost: ${deletedPost}, creator: ${creator}, deletingPostId: ${args._id}`);
            return deletedPost;
        } catch (err) {
            throw err;
        }
    }
};