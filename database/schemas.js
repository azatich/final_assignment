const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    isAdmin: Boolean,
    username: String, 
    phone: String, 
    password: String, 
    registrationDate: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now }
});
const deletedUserSchema = new mongoose.Schema({
    username: String, 
    phone: String,
    registrationDate: { type: Date, default: Date.now },
    deletionDate: { type: Date, default: null }
});
const postSchema = new mongoose.Schema({
    post_id: Number,
    title: String,
    images: [String],
    content: String,
    postedDate: { type: Date, default: null },
    lastUpdateDate: { type: Date, default: null },
    comments: [{
        username: String,
        comment: String
    }]
});

const Post = mongoose.model('Post', postSchema);
const DeletedUser = mongoose.model('DeletedUser', deletedUserSchema, 'deletedUsers');
const User = mongoose.model('User', userSchema, 'movieUsers');

module.exports = { User, DeletedUser, Post };