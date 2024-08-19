import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Updated to use Routes
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Use element instead of component */}
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
