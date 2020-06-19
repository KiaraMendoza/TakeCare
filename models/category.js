//Requires from node_modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
});

module.exports = mongoose.model('Category', categorySchema);