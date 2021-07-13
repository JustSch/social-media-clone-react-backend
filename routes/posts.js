const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const { ensureAuthenticated } = require('../config/auth');

router.post('/createPost',ensureAuthenticated,(req,res) => {
  

    const message = req.body;

    if (message == ''){
        res.render('Error ');
        return;
    }
    const newPost = new Post;
    newPost.userID = req.user.id;
    newPost.content = message.message;
    newPost.save().then(user => {
        res.redirect('/PostCreator');
    }).catch(err => console.log(err));
});

module.exports = router;