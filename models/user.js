//Requires from node_modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    rol: { type: String, required: true },
    imageUrl: { type: String },
    createdPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    createdComments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    likedPosts: [{ type: Schema.Types.ObjectId, ref: 'PostLike' }],
    likedComments: [{ type: Schema.Types.ObjectId, ref: 'CommentLike' }],
});

module.exports = mongoose.model('User', userSchema);