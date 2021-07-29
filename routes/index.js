const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth");
const {ensureAuthenticatedHome} = require("../config/authhome");
const {ensureAuthenticatedProfile} = require("../config/authprofile");
const Post = require("../models/posts");
const User = require("../models/user");

router.get("/", ensureAuthenticatedHome, (req, res) => res.redirect("/dashboard"));

router.get("/dashboard", ensureAuthenticated, (req, res) => res.render("dashboard", {name: req.user.name}));

router.get("/PostCreator", ensureAuthenticated, (req, res) => res.render("createPost"));

//API Routes
router.get("/api/:username/posts", function (req, res) {
  User.findOne({
    name: req.params.username
  }, function (err, users) {
    if (err) 
      return console.error(err);
    
    if (users) {
      Post.find({
        userID: users._id
      }, function (err2, posts) {
        if (err2) 
          return console.error(err2);
        const result = posts.map(({content, date}) => {
          return {name: users.name, content: content, date: date};
        });
        res.json(result);
      }).sort("-date");
    } else {
      res.sendStatus(500);
    }
  });
});

router.get("/api/:username", function (req, res) {
  User.findOne({
    name: req.params.username
  }, function (err, users) {
    if (err) 
      return console.error(err);
    
    if (users) {
      const result = user => {
        return {name: user.name, following: user.following, followers: user.followers};
      };
      res.json(result(users));
    } else {
      res.sendStatus(500);
    }
  });
});

router.get("/api/isFollowing/:username", function (req, res) {
  if (req.user) {
    User.findOne({
      name: req.params.username
    }, function (err, users) {
      if (err) 
        return console.error(err);
      if (users) {
        if (req.user.following.includes(req.params.userID)) {
          res.json({isFollowing: true});
        } else {
          res.json({isFollowing: false});
        }
      }
    });
  } else {
    res.json({});
  }
});
router.get("/api/user/isAuthenticated", function (req, res) {
  if (req.user) {
    res.json({isAuthenticated: true});
  } else {
    res.json({isAuthenticated: false});
  }
});

//Profile Routes
router.get("/:username/", (req, res) =>
//check if valid username or give error page
res.render("profile"));

router.get("/:username/post/:postID", (req, res) =>
//check if valid username and valid post id
res.send("username: " + req.params.username + " postID: " + req.params.postID));

module.exports = router;
