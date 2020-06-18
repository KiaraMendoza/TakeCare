//Requires from the project
const Post = require('../../models/post');
const Comment = require('../../models/comment');
const User = require('../../models/user');
const { transformPost } = require('./merge');

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
            return transformPost(post);
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
            creator: req.userId
        });
        let createdPost;
        try {
            const result = await post.save();
            createdPost = transformPost(result);
            const creator = await User.findById(req.userId);
            if (!creator) {
                throw new Error('User not found.')
            }
            creator.createdPosts.push(post);
            await creator.save();
            return createdPost;
        } catch (err) {
            throw err;
        }
    },
};