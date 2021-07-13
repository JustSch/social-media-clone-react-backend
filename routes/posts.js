const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const { ensureAuthenticated } = require('../config/auth');

router.post('/createPost',ensureAuthenticated,(req,res) => {
  
    let errors = []
    const message = req.body;

    if (message.message == ''){
        errors.push({ msg: 'Please enter all fields' });

        if (errors.length > 0){
            res.render('createPost',{
                errors
            });
        }
    }

    else {
        const newPost = new Post;
        newPost.userID = req.user.id;
        newPost.content = message.message;
        newPost.save().then(user => {
        req.flash('success_msg', 'Post Submitted Successfully');
        res.redirect('/PostCreator');
            }).catch(err => console.log(err));
    }
    
});

module.exports = router;