const express = require("express");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// Configure Passport to use GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5001/api/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Store the GitHub profile in the session
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user information for the session
passport.serializeUser((user, done) => {
  // Save only the user ID in the session
  done(null, user.id);
});

// Fetch the user data from GitHub during deserialization
passport.deserializeUser(async (id, done) => {
  try {
    // Fetch the full user profile from GitHub
    const response = await axios.get(`https://api.github.com/user/${id}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "axios/0.21.4",
      },
    });

    const user = response.data;
    done(null, user); // Pass the full user profile to req.user
  } catch (error) {
    done(error, null);
  }
});

// GitHub login route
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub callback route
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/" }), (req, res) => {
  res.redirect("http://localhost:3000/profile");
});

// Route to get the logged-in user's data
router.get("/user", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json(req.user); // Send the full user profile
});

// Route to fetch the logged-in user's PRs during Hacktoberfest
router.get("/prs", async (req, res) => {
  const username = req.user?.username || req.user?.login;

  if (!username) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    const response = await axios.get("https://api.github.com/search/issues", {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "axios/0.21.4",
      },
      params: {
        q: `author:${username} type:pr created:>2023-09-30`,
      },
    });

    const pullRequests = response.data.items.map((pr) => ({
      title: pr.title,
      url: pr.html_url,
      repository: pr.repository_url.split("/").pop(),
      created_at: pr.created_at,
    }));

    res.status(200).json({ pullRequests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pull requests" });
  }
});

module.exports = router;
