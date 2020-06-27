//Requires from node_modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentLikeSchema = new Schema({
    comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('CommentLike', commentLikeSchema);