//Requires from the project
const Post = require('../../models/post');
const Comment = require('../../models/comment');
const Category = require('../../models/category');
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

        // If we are changing post category, we need to change them in category's posts array too.
        if (updatedPost.category._id != post.category){
            // Find the old category doc and filtering the post we are updating
            const oldCategory = await Category.findById(post.category);
            console.log(`post._id: ${post._id}, oldCategory: ${oldCategory._id}`);
            console.log(`oldCategory.posts: ${oldCategory.posts}`);
            const updatedCategoryPosts = oldCategory.posts.filter(post => {
                console.log(post, args._id);
                return post != args._id
            });
            console.log(`updatedCategoryPosts: ${updatedCategoryPosts}`);

            await Category.update({ _id: post.category }, { posts: updatedCategoryPosts });

            // Find the new category doc and adding the post
            const category = await Category.findById(args.category);
            if (!category) {
                throw new Error('Category not found.')
            }
            category.posts.push(updatedPost._id);
            await category.save();
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
        
        const updatedCreatorPosts = creator.createdPosts.filter(post => {
            console.log(post, args._id);
            return post != args._id
        });

        await User.update({ _id: getPostToDelete.creator },{ createdPosts: updatedCreatorPosts});

        const updatedCategoryPosts = category.posts.filter(post => {
            console.log(post, args._id);
            return post != args._id
        });

        await Category.update({ _id: getPostToDelete.category }, { posts: updatedCategoryPosts });

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