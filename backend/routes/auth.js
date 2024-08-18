const express = require("express");
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;

const router = express.Router();

require("dotenv").config();

// Use GitHubStrategy within Passport
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5001/api/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Initialize Passport and session
router.use(require("express-session")({ secret: "secret", resave: true, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

// Route for GitHub login
router.get("/github", passport.authenticate("github"));

// Callback URL after GitHub login
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/" }), (req, res) => {
  // Successful authentication, redirect home
  res.redirect("http://localhost:3000/profile");
});

router.get("/user", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user);
});

module.exports = router;
