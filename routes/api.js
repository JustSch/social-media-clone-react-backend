const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/user");
const { ensureAuthenticated } = require("../config/auth");
const passport = require('passport');


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

router.get("/user/isAuthenticated", function (req, res) {
    if (req.user) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});

router.post("/user/follow/", ensureAuthenticated, function (req, res) {

    let username = req.body.username;
    let newFollower = "";
    User.findOne({
        name: username
    }, function (err, users) {
        if (err)
            return console.error(err);

        if (users) {
            newFollower = users.id;
            User.updateOne({ name: req.user.name }, { $addToSet: { following: [newFollower] } }, function (err2, result) {
                if (err2) {
                    res.send(err2);
                }
            });
            User.updateOne({ name: users.name }, { $addToSet: { followers: [req.user.id] } }, function (err3, result) {
                if (err3) {
                    res.send(err3);
                }
                else {
                    console.log(result);
                }
            });
        } else {
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
    });

});

router.post("/user/unfollow/", ensureAuthenticated, function (req, res) {

    let username = req.body.username;
    let follower = "";
    User.findOne({
        name: username
    }, function (err, users) {
        if (err)
            return console.error(err);

        if (users) {
            follower = users.id;
            User.updateOne({ name: req.user.name }, { $pullAll: { following: [follower] } }, function (err4, result) {
                if (err4) {
                    res.send(err4);
                }
            });
            User.updateOne({ name: users.name }, { $pullAll: { followers: [req.user.id] } }, function (err5, result) {
                if (err5) {
                    res.send(err5);
                }
                else {
                    console.log(result);
                }
            });
        } else {
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
    });

});

router.get("/post/postDashboard", ensureAuthenticated, async function (req, res) {
    let followedUserIDs = req.user.following;
    const posts = await Post.find({ userID: followedUserIDs }).populate('userID').sort("-date");
    const post_result = posts.map(({ userID, date, content }) => {
        return { name: userID.name, date: date, content: content };
    });
    res.send(post_result);
});

router.get("/search/:username", function (req, res) {
    User.find({
        name: { $regex: req.params.username }
    }, function (errr, users) {
        if (errr)
            return console.log(errr);
        if (users) {
            const result = users.map(({ name }) => {
                return { name: name };
            });

            res.json(result);
        }
        else {
            res.sendStatus(404);
        }
    });
});


router.get("/:username/posts", async function (req, res) {

    const users = await Post.find({ name: req.params.username });

    if (!users) console.log("could not find user")
    else {
        const posts = Post.find({ userID: users._id }).sort("-date");

        if (posts) {
            const result = posts.map(({ content, date }) => {
                return { name: users.name, content: content, date: date };
            });
            res.json(result);
        }
        else {
            res.sendStatus(500);
        }
    }
});

router.get("/:username", function (req, res) {
    User.findOne({
        name: req.params.username
    }, function (err, users) {
        if (err)
            return console.error(err);

        if (users) {
            const result = user => {
                return { name: user.name, following: user.following, followers: user.followers };
            };
            res.json(result(users));
        } else {
            res.sendStatus(500);
        }
    });
});

router.get("/isFollowing/:username", function (req, res) {
    if (req.user) {
        User.findOne({
            name: req.params.username
        }, function (err, users) {
            if (err)
                return console.error(err);
            if (users) {
                if (req.user.following.includes(users.id)) {
                    res.json({ isFollowing: true });
                } else {
                    res.json({ isFollowing: false });
                }
            }
        });
    } else {
        res.json({});
    }
});
module.exports = router;