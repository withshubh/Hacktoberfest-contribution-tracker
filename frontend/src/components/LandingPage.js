import React, { useState } from "react";

function LandingPage() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    window.location.href = "http://localhost:5001/api/auth/github";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-8 max-w-md w-full">
        <div className="text-center">
          <span className="text-6xl">🦄</span>
          <h2 className="mt-6 text-3xl font-extrabold text-white">Hacktoberfest Contributions Tracker</h2>
          <p className="mt-2 text-sm text-gray-300">Track your contributions easily</p>
        </div>
        <div className="mt-8">
          <button
            className="w-full bg-white text-black rounded-lg py-2 px-4 flex justify-center items-center space-x-2 hover:bg-gray-400 transition"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : (
              <>
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.016-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.305-5.467-1.333-5.467-5.93 0-1.31.467-2.38 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.005-.404 1.022.005 2.048.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.624-5.48 5.922.43.372.812 1.102.812 2.222 0 1.606-.015 2.896-.015 3.293 0 .322.218.694.825.576C20.565 22.092 24 17.593 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span>Sign in with GitHub</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
