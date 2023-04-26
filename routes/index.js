const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const { ensureAuthenticatedHome } = require("../config/authhome");
const { ensureAuthenticatedProfile } = require("../config/authprofile");


router.get("/", ensureAuthenticatedHome, (req, res) => res.redirect("/dashboard"));

router.get("/templateDashboard", ensureAuthenticated, (req, res) => res.render("templateDashboard", { name: req.user.name }));

router.get("/PostCreator", ensureAuthenticated, (req, res) => res.render("createPost"));

router.get("/dashboard", ensureAuthenticated, (req, res) => res.render("dashboard"));



router.get("/search", (req, res) =>
  res.render("userSearch"));


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
