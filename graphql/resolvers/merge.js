//Requires from the project
const Comment = require('../../models/comment');
const Post = require('../../models/post');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

//Functions for making the relations between models
const posts = async postsIds => {
    try {
        const posts = await Post.find({ _id: { $in: postsIds } });
        return posts.map(post => {
            return transformPost(post);
        });
    }
    catch (err) {
        throw err;
    };
};

const singlePost = async postId => {
    try {
        const post = await Post.findById(postId);
        return transformPost(post);
    } catch (err) {
        throw err;
    };
};

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            createdPosts: posts.bind(this, user._doc.createdPosts)
        };
    } catch (err) {
        throw err;
    };
};

//Function for refactoring transforms
const transformPost = post => {
    return {
        ...post._doc,
        createdAt: dateToString(post._doc.createdAt),
        updatedAt: dateToString(post._doc.updatedAt),
        creator: user.bind(this, post.creator)
    };
};

const transformComment = comment => {
    return {
        ...comment._doc,
        user: user.bind(this, comment._doc.user),
        post: singlePost.bind(this, comment._doc.event),
        createdAt: dateToString(comment._doc.createdAt),
        updatedAt: dateToString(comment._doc.updatedAt)
    }
};

exports.transformPost = transformPost;
exports.transformComment = transformComment;

//exports.user = user;
//exports.posts = posts;
//exports.singlePost = singlePost;