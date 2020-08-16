const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, trim: true },
    password: { type: String, required: false },
    email: {type: String, required: true},
    isgoogleauthenticate: { type: Boolean, required: true }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);
module.exports = User;