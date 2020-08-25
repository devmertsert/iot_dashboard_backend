const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedDataSchema = new Schema({
    parentId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        default: undefined
    },
    data: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: 'feeddata'
});

module.exports = mongoose.model('FeedData', feedDataSchema);