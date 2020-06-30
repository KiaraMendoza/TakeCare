//Requires from the project
const Comment = require('../../models/comment');
const Post = require('../../models/post');
const User = require('../../models/user');
const { transformComment, transformPost, transformUser } = require('./merge');

module.exports = {
    createComment: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('You don\'t have permission to do that');
        }
        const comment = new Comment({
            content: args.commentInput.content,
            post: args.commentInput.postId,
            creator: req.userId
        });
        const post = await Post.findById(args.commentInput.postId);
        post.comments.push(comment);
        await post.save();

        const user = await User.findById(req.userId);
        user.createdComments.push(comment);
        await user.save();

        try {
            await comment.save();
            const result = transformComment(comment);
            console.log(`comment ${comment}, result: ${result}`)
            return comment;
        } catch (err) {
            throw err;
        }
    },
    postComments: async (args) => {
        const post = await Post.findById(args.postId);
        //const transformedPost = transformPost(post);
        const comments = post.comments.map(comment => transformComment(comment));

        console.log(`transformComment(comments): ${post.comments}`);

        return comments;
    },
    userComments: async (args) => {
        const user = await User.findById(args.userId);
        const transformedUser = transformUser(user);
        const comments = transformedUser.createdComments.map(comment => comment);

        return comments;
    }
};