//Requires from node_modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    race: { type: Schema.Types.ObjectId, ref: 'Race' },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'PostLike' }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);