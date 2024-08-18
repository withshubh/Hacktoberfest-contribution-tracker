const express = require("express");
const axios = require("axios");
const Contributor = require("../models/Contributor");
const router = express.Router();

const GITHUB_API_URL = "https://api.github.com";

// Fetch PRs for a given GitHub username
router.get("/prs/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(`${GITHUB_API_URL}/search/issues`, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
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

    let contributor = await Contributor.findOne({ githubUsername: username });

    if (!contributor) {
      contributor = new Contributor({ githubUsername: username, pullRequests, totalPRs: pullRequests.length });
    } else {
      contributor.pullRequests = pullRequests;
      contributor.totalPRs = pullRequests.length;
    }

    await contributor.save();

    res.status(200).json(contributor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching pull requests" });
  }
});

module.exports = router;
