//Requires from node_modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postLikeSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('PostLike', postLikeSchema);