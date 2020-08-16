const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    to: { type: String, required: true, trim: true },
    from: { type: String, required: true, trim: true },
    read: { type: Boolean, required: true, trim: true },
    chatHistory: { type: String, required: true },
}, { timestamps: true })

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;