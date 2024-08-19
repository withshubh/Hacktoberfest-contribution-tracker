import React, { useEffect, useState } from "react";
import axios from "axios";

const HistoryTab = ({ username }) => {
  const [contributions, setContributions] = useState([]);

  // Fetch contribution history
  useEffect(() => {
    if (username) {
      axios
        .get(`https://api.github.com/users/${username}/events`)
        .then((response) => {
          setContributions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching contribution history:", error);
        });
    }
  }, [username]);

  return (
    <div>
      <h2>Contribution History</h2>
      <ul>
        {contributions.map((event) => (
          <li key={event.id}>
            {event.type} - {event.repo.name} at {new Date(event.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryTab;
