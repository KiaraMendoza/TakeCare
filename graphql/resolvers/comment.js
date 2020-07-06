//Requires from the project
const Comment = require('../../models/comment');
const Post = require('../../models/post');
const User = require('../../models/user');
const { transformComment, transformPost, transformUser, commentSingle } = require('./merge');
const { filterArray } = require('../../helpers/filterArray');

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
            const transformedComment = transformComment(comment);
            return transformedComment;
        } catch (err) {
            throw err;
        }
    },
    postComments: async (args) => {
        try {
            const post = await Post.findById(args.postId);
            return post.comments.map(comment => {
                return commentSingle(comment);
            });
        } catch (err) {
            throw err;
        }
    },
    userComments: async (args) => {
        try {
            const user = await User.findById(args.userId);
            return user.createdComments.map(comment => {
                return commentSingle(comment);
            });
        } catch(err) {
            throw err;
        }
    },
    updateComment: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('You don\'t have permission to do that');
        }
        try {
            console.log(`Comment back` + args.commentEditInput.commentId, args.commentEditInput.content);
            const updatedComment = await Comment.findByIdAndUpdate(args.commentEditInput.commentId, { content: args.commentEditInput.content });
            await updatedComment.save();
            const transformedComment = transformComment(updatedComment);
            return transformedComment;
        } catch(err) {
            throw err;
        }
    },
    deleteComment: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('You don\'t have permission to do that');
        }
        try {
            const toDeletedComment = await Comment.findById(args._id);

            const creator = await User.findById(toDeletedComment.creator);
            const updatedCreatorComments = filterArray(args._id, creator.createdComments);
            await User.update({ _id: toDeletedComment.creator }, { createdComments: updatedCreatorComments ? updatedCreatorComments : [] });

            const post = await Post.findById(toDeletedComment.post);
            const updatedPostComments = filterArray(args._id, post.comments);
            await Post.update({ _id: toDeletedComment.post }, { comments: updatedPostComments ? updatedPostComments : [] });
            
            console.log(toDeletedComment);
            await Comment.findByIdAndDelete(args._id);
            console.log(toDeletedComment);
            return toDeletedComment;
        } catch(err) {
            throw err;
        }
    }
};