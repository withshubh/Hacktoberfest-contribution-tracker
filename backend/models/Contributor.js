const mongoose = require("mongoose");

const ContributorSchema = new mongoose.Schema({
  githubUsername: { type: String, required: true },
  pullRequests: [{ type: Object }],
  totalPRs: { type: Number, default: 0 },
});

module.exports = mongoose.model("Contributor", ContributorSchema);
