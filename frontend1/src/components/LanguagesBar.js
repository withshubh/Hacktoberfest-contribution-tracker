import React, { useState, useEffect } from "react";

const LanguagesBar = ({ languagesData = [] }) => {
  const [loading, setLoading] = useState(true);

  // Fixed colors for the top 5 languages
  const fixedColors = ["#b22a00", "#6d1b7b", "#1c54b2", "#00a0b2", "#b2a429"];

  useEffect(() => {
    // Simulate a loading state for 5 seconds
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  // If still loading, show skeleton bars and names
  if (loading) {
    return (
      <div className="mt-4">
        {/* Loading skeleton for the bar */}
        <div className="flex h-4 rounded-full bg-gray-200 overflow-hidden">
          <div className="animate-pulse bg-gray-400 w-full h-full"></div>
        </div>

        {/* Loading skeleton for the language names */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="w-4 h-4 rounded-full bg-gray-400 animate-pulse"></span>
              <span className="w-20 h-4 bg-gray-400 rounded-md animate-pulse"></span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no languages data is available
  if (!Array.isArray(languagesData) || languagesData.length === 0) {
    return <p className="text-gray-400 mt-4">No language data available</p>;
  }

  // Helper function to assign consistent colors
  const assignColors = () => {
    const colors = {};
    languagesData.forEach((item, index) => {
      // Use fixed colors for the top 5 languages, and random colors for others
      if (index < 5) {
        colors[item.language] = fixedColors[index];
      } else {
        // Fallback to random colors for languages beyond the top 5
        colors[item.language] = `#${Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0")}`;
      }
    });
    return colors;
  };

  const colors = assignColors();
  const totalPercentage = languagesData.reduce((acc, item) => acc + parseFloat(item.percentage), 0);

  return (
    <div className="mt-4">
      {/* Render the stacked bar */}
      <div className="flex h-4 rounded-full bg-gray-200 overflow-hidden">
        {languagesData.map((item, index) => (
          <div
            key={index}
            className="h-full"
            style={{
              width: `${(item.percentage / totalPercentage) * 100}%`,
              backgroundColor: colors[item.language],
            }}
          ></div>
        ))}
      </div>

      {/* Render language color balls with names */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {languagesData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: colors[item.language] }}></span>
            <span className="text-gray-400">{item.language}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguagesBar;
