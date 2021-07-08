const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    userID:{
        type : Number,
        required : true
    },
    locked :{
        type: Boolean
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
    },
    uri: {
        type: String,
        required: true
    }

})

const Post = mongoose.model('Post',PostSchema);

module.exports = Post;