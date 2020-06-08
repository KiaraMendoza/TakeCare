//Requires from node_modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdEvents: [ { type: Schema.Types.ObjectId, ref: 'Event' } ],
});

module.exports = mongoose.model('User', userSchema);