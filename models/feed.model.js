const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const feedSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    feedName: {
        type: String,
        required: true
    },
    idForChildren: {
        type: String,
        default: uuidv4()
    }
}, {
    timestamps: true,
    collection: 'feeds'
});

module.exports = mongoose.model('Feed', feedSchema);