const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const { ensureAuthenticated } = require('../config/auth');

router.post('/createPost',ensureAuthenticated,(req,res) => {
  

    const message = req.body;

    if (message == '' || message == none){
        res.render('Error ');
        return;
    }

    const newPost = new Post({
        none,
        message
    });
    newPost.id = req.user.id;
    newPost.save().catch(err => console.log(err));
});

module.exports = router;