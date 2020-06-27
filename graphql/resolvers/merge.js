//Requires from the project
const Comment = require('../../models/comment');
const Post = require('../../models/post');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');
const Category = require('../../models/category');
const Race = require('../../models/race');

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

const category = async categoryId => {
    try {
        const category = await Category.findById(categoryId);
        return {
            ...category._doc,
            posts: posts.bind(this, category._doc.posts)
        };
    } catch (err) {
        throw err;
    };
};

const race = async raceId => {
    try {
        const race = await Race.findById(raceId);
        return {
            ...race._doc,
            posts: posts.bind(this, race._doc.posts)
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
        creator: user.bind(this, post.creator),
        category: category.bind(this, post.category),
        race: race.bind(this, post.race)
    };
};

const transformUpdatedPost = (post, args) => {
    return {
        ...post._doc,
        createdAt: dateToString(post._doc.createdAt),
        updatedAt: dateToString(post._doc.updatedAt),
        title: args.title || post.title,
        description: args.description || post.description,
        imageUrl: args.imageUrl || post.imageUrl,
        category: args.category || post.category,
        race: args.race || post.race,
    };
};


const transformComment = comment => {
    return {
        ...comment._doc,
        user: user.bind(this, comment._doc.user),
        post: singlePost.bind(this, comment._doc.post),
        createdAt: dateToString(comment._doc.createdAt),
        updatedAt: dateToString(comment._doc.updatedAt)
    }
};

const transformUser = singleUser => {
    return {
        ...singleUser._doc,
        createdPosts: posts.bind(this, singleUser.createdPosts)
    };
};

const transformCategory = singleCategory => {
    return {
        ...singleCategory._doc,
        posts: posts.bind(this, singleCategory.posts)
    };
};

const transformRace = singleCategory => {
    return {
        ...singleCategory._doc,
        posts: posts.bind(this, singleCategory.posts)
    };
};

exports.transformPost = transformPost;
exports.transformUpdatedPost = transformUpdatedPost;
exports.transformComment = transformComment;
exports.transformUser = transformUser;
exports.transformCategory = transformCategory;
exports.transformRace = transformRace;