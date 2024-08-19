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
      console.log("User authenticated:", profile.username); // Log once after authentication
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user information for the session
passport.serializeUser((user, done) => {
  done(null, user.id); // Only store user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const response = await axios.get(`https://api.github.com/user/${id}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "axios/0.21.4",
      },
    });
    const user = response.data;
    done(null, user); // Pass user profile to session
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

router.get("/social-accounts", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const response = await axios.get("https://api.github.com/user/social_accounts", {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    console.log("Fetched social accounts from GitHub:", response.data);
    const socialAccounts = response.data;
    res.status(200).json(socialAccounts);
  } catch (error) {
    console.error("Error fetching social accounts:", error);
    res.status(500).json({ message: "Error fetching social accounts" });
  }
});

router.get("/languages", async (req, res) => {
  console.log("Languages route accessed");

  const username = req.user?.login; // Ensure the user is logged in
  if (!username) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    console.log(`Fetching repos for user: ${username}`);
    const repos = await axios.get(`https://api.github.com/users/${username}/repos`, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
    });

    const languageMap = {};

    // Fetch languages for each repo and accumulate byte usage
    for (const repo of repos.data) {
      console.log(`Fetching languages for repo: ${repo.name}`);
      const { data: languages } = await axios.get(repo.languages_url, {
        headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
      });

      if (Object.keys(languages).length === 0) {
        console.log(`No languages found for repo: ${repo.name}`);
        continue;
      }

      console.log(`Languages for repo: ${repo.name}`, languages);

      // Accumulate language byte counts
      for (const [lang, bytes] of Object.entries(languages)) {
        if (!languageMap[lang]) {
          languageMap[lang] = 0;
        }
        languageMap[lang] += bytes;
      }
    }

    // Check if there are any languages to process
    if (Object.keys(languageMap).length === 0) {
      console.log("No languages data found for user.");
      return res.status(200).json([]);
    }

    const totalBytes = Object.values(languageMap).reduce((acc, bytes) => acc + bytes, 0);

    // Calculate percentages and sort them
    const languagePercentages = Object.entries(languageMap)
      .map(([lang, bytes]) => ({
        language: lang,
        percentage: ((bytes / totalBytes) * 100).toFixed(2),
      }))
      .sort((a, b) => b.percentage - a.percentage) // Sort by percentage, descending
      .slice(0, 5); // Only keep top 5 languages

    console.log("Top 5 languages with percentages:", languagePercentages);
    res.status(200).json(languagePercentages); // Send only the top 5 languages
  } catch (error) {
    console.error("Error fetching languages:", error);
    res.status(500).json({ error: "Error fetching languages" });
  }
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

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    // Clear the session cookie
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error destroying session" });
      }
      res.clearCookie("connect.sid"); // Replace with your session cookie name if different
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;
