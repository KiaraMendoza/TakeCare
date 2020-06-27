//Requires from node_modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const raceSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

module.exports = mongoose.model('Race', raceSchema);