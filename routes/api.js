const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/user");
const { ensureAuthenticated } = require("../config/auth");
const passport = require('passport');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.status(401).json(errors);
    }

    else {
        const user = await User.find({ email: email });
        
        const userWithName = await User.find({ name: name });

        if (user[0]) {
            res.status(401).json({ msg: 'A User With That Email Already Exists' });
        }

        else if(userWithName[0]){
            res.status(401).json({ msg: 'A User With That Username Already Exists'});
        }

        else {
            const newUser = new User({
                name,
                email,
                password
            });

            bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            res.status(200).json({ msg: 'registration successful' });
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(401).json({ msg: 'An unknown error has occured while trying to register' });
                        });
                }));
        }
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    if (!req.user) {
        res.status(401).send(error);
    }
    else {
        res.status(200).send({ 'login': 'success' });
    }
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            res.status(500).send({ 'logout': 'failed' });
        }
        else {
            res.status(200).send({ 'logout': 'success' });
        }
    });
});
router.post("/createPost", ensureAuthenticated, (req, res) => {
    if (!req.body.message) {
        res.status(401).send("You Can Not Create An Empty Post!");
    }
    else {
        const newPost = new Post;
        newPost.userID = req.user._id;
        newPost.content = req.body.message;
        newPost.save()
            .then((user) => {
                res.status(200).send("Post Sent Successfully");
            })
            .catch(err => {
                console.log(err);
                res.status(401).send("An unknown error occured while creating your post");
            });

    }

});
router.get("/user/isAuthenticated", function (req, res) {
    if (req.user) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});

router.post("/user/follow/", ensureAuthenticated,async function (req, res) {

    let username = req.body.username;
    let newFollower = "";

    const user = await User.find({ name: username });

    if (user[0]) {
        newFollower = user[0].id;
        let follower = await User.updateOne({ name: req.user.name }, { $addToSet: { following: { $each: [newFollower]} }});
        let followee = await User.updateOne({ name: user[0].name }, { $addToSet: { followers: { $each:  [req.user.id]} }});
        
        if (follower.modifiedCount === 1 && followee.modifiedCount === 1){
            res.status(200).json({msg: 'User Followed Successfully'});
        }

        else {
            res.status(401).json({ msg: 'You can not follow a user that you already follow' });
        }
        
    }
    else {
        res.status(500).json({msg: 'You can not follow a user that does not exist'});
    }

});

router.post("/user/unfollow/", ensureAuthenticated,async function (req, res) {

    let username = req.body.username;

    const user = await User.find({ name: username });
    if (user[0]) {
        let removedFollower = user[0].id;
        let follower = await User.updateOne({ name: req.user.name }, { $pullAll: { following: [removedFollower] } });
        let followee = await User.updateOne({ name: user[0].name }, { $pullAll: { followers: [req.user.id] } });
        if (follower.modifiedCount === 1 && followee.modifiedCount === 1){
            res.status(200).json({msg: 'User UnFollowed Successfully'});
        }

        else {
            res.status(401).json({ msg: 'You can not unfollow a user that you do not follow' });
        }
    }
    else{
        res.status(500).json({msg: 'You can not unfollow a user that does not exist'});
    }

});

router.get("/post/postDashboard", ensureAuthenticated, async function (req, res) {
    let followedUserIDs = req.user.following;
    followedUserIDs.push(req.user.id);
    const posts = await Post.find({ userID: followedUserIDs }).populate('userID').sort("-date");
    const post_result = posts.map(({ userID, date, content }) => {
        return { name: userID.name, date: date, content: content };
    });
    res.send(post_result);
});

router.get("/search/:username", async function (req, res) {
    const users = await User.find({ name: { $regex: req.params.username } });
    if (!users) {
        res.status(404).send("No Users Could Be Found");
    }
    else {
        const result = users.map(({ name }) => {
            return { name: name };
        });
        res.json(result);
    }
});


router.get("/user/:username/posts", async function (req, res) {
    const users = await User.find({ name: req.params.username });
    if (users[0]) {
        const posts = await Post.find({ userID: users[0]._id }).sort("-date");
        const result = posts.map(({ content, date }) => {
            return { name: users[0].name, content: content, date: date };
        });
        res.json(result);
    }
    else {
        res.status(404).json([]);
    }

});

router.get("/user/:username", async function (req, res) {
    const users = await User.find({ name: req.params.username });
    if (users[0]) {
        const result = user => {
            return { name: user.name, following: user.following, followers: user.followers };
        };
        res.json(result(users[0]));
    }
    else {
        res.status(404).json([]);
    }
});

router.get("/isFollowing/:username",ensureAuthenticated ,async function (req, res) {
    let followedUser = await User.find({ name: req.params.username });

    if (followedUser[0]){
        if (req.user.name === followedUser[0].name) {
            res.json({ isFollowing: 'own'});
        }
        else if (req.user.following.includes(followedUser[0].id)) {
            res.json({ isFollowing: true });
        } else {
            res.json({ isFollowing: false });
        }
    }

    else {
        res.status(404).json({msg: 'followed user could not be found'});
    }
    
});
module.exports = router;