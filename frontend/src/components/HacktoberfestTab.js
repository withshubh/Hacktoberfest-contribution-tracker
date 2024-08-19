import React, { useEffect, useState } from "react";
import axios from "axios";

const HacktoberfestTab = ({ username }) => {
  const [prs, setPRs] = useState([]);

  // Fetch PR data from the backend
  useEffect(() => {
    if (username) {
      axios
        .get(`http://localhost:5001/api/github/prs/${username}`) // Fetch PRs from backend
        .then((response) => {
          setPRs(response.data.pullRequests);
        })
        .catch((error) => {
          console.error("Error fetching PR data:", error);
        });
    }
  }, [username]);

  return (
    <div>
      <h2>Hacktoberfest Contributions</h2>
      <p>Total PRs: {prs.length}</p>
      <ul>
        {prs.map((pr) => (
          <li key={pr.url}>
            <a href={pr.url} target="_blank" rel="noopener noreferrer">
              {pr.title}
            </a>{" "}
            - {pr.repository}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HacktoberfestTab;
