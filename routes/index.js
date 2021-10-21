const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth");
const {ensureAuthenticatedHome} = require("../config/authhome");
const {ensureAuthenticatedProfile} = require("../config/authprofile");
const Post = require("../models/posts");
const User = require("../models/user");

router.get("/", ensureAuthenticatedHome, (req, res) => res.redirect("/dashboard"));

router.get("/templateDashboard", ensureAuthenticated, (req, res) => res.render("templateDashboard", {name: req.user.name}));

router.get("/PostCreator", ensureAuthenticated, (req, res) => res.render("createPost"));

router.get("/dashboard", ensureAuthenticated, (req, res) => res.render("dashboard"));

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
        if (req.user.following.includes(users.id)) {
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

router.post("/api/user/follow/", ensureAuthenticated, function(req,res) {
  
  var username =req.body.username;
  var newFollower ="";
  User.findOne({
    name: username
  }, function (err, users) {
    if (err) 
      return console.error(err);
    
    if (users) {
     newFollower = users.id;
     User.updateOne({name: req.user.name},{ $addToSet: {following: [newFollower]}}, function(err2, result){
      if (err2) {
        res.send(err2);
      } 
     });
     User.updateOne({name: users.name},{ $addToSet: {followers: [req.user.id]}}, function(err3, result){
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

router.post("/api/user/unfollow/", ensureAuthenticated, function(req,res) {
  
  var username =req.body.username;
  var follower ="";
  User.findOne({
    name: username
  }, function (err, users) {
    if (err) 
      return console.error(err);
    
    if (users) {
     follower = users.id;
     User.updateOne({name: req.user.name},{ $pullAll : {following: [follower]}}, function(err4, result){
      if (err4) {
        res.send(err4);
      } 
     });
     User.updateOne({name: users.name},{ $pullAll : {followers: [req.user.id]}}, function(err5, result){
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

router.get("/api/post/postDashboard", ensureAuthenticated, function(req, res){
  var followedUserIDs = req.user.following;
  Post.find({
    userID: followedUserIDs
  }, function (err5, posts) {
    if (err5) 
      return console.error(err5);

    const post_result = posts.map(({userID, date, content}) => {
      return {name: userID.name, date: date, content: content};
    });

    res.send(post_result);
       
  }).populate('userID').sort("-date");

});

router.get("/api/search/:username",function(req, res){
  User.find({
    name: {$regex: req.params.username}
  }, function (errr, users) {
    if (errr)
      return console.log(errr);
    if (users) {
      const result = users.map(({name}) => {
        return {name: name};
      });
      
      res.json(result);
    }
    else {
      res.sendStatus(404);
    }
  });
});

//Profile Routes
router.get("/:username/", (req, res) =>
//check if valid username or give error page
res.render("profile"));

router.get("/:username/post/:postID", (req, res) =>
//check if valid username and valid post id
res.send("username: " + req.params.username + " postID: " + req.params.postID));


//TODO create link to users displayed in posts and ability to search and follow from search and hide follow on own account
//change logos

module.exports = router;
