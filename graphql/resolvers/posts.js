//Requires from the project
const Post = require('../../models/post');
const Comment = require('../../models/comment');
const User = require('../../models/user'); 
const { transformPost, user, transformUpdatedPost } = require('./merge');

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
            category: args.postInput.category,
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
    updatePost: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('You don\'t have permission to do that');
        }
        const post = await Post.findById(args._id);
        if (!post) {
            throw new Error(`Couldn't find post with id ${args._id}`);
        }
        let updatedPost = transformUpdatedPost(post, args);

        //  console.log("Post found by ID " + post._doc.creator.username + " " + post._doc.creator._id)
        //  console.log("Transformed post found by ID " + updatedPost._id + " " + updatedPost.creator._id, + " " + updatedPost.creator.username)
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
        
        //let indexPostToDelete = creator.createdPosts.indexOf(args._id);
        const updatedCreatorPosts = await creator.createdPosts.filter(post => post !== args._id);

        console.log(`updatedCreatorPosts: ${updatedCreatorPosts}, indexPostToDelete: {indexPostToDelete}`)

        try {
            // const deletePostOnCreator = await remove(creator.createdPosts, args._id);
            const deletedPost = await Post.findByIdAndDelete(args._id);
            console.log(`deletedPost: ${deletedPost}, creator: ${creator}, deletingPostId: ${args._id}, indexPostToDelete: ${indexPostToDelete}`);
            return deletedPost;
        } catch (err) {
            throw err;
        }
    }
};