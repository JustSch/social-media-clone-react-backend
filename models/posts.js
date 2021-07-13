const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    userID:{
        type : String
    }, 
    date:{
        type : Date,
        default : Date.now
    },
    content:{
        type: String,
        required: true
    },
    replies: {
        type: []
    }

})

const Post = mongoose.model('Post',PostSchema);

module.exports = Post;