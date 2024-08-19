import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faInstagram, faYoutube, faTwitch } from "@fortawesome/free-brands-svg-icons";
import LanguagesBar from "./LanguagesBar";
import { Tab, TabGroup, TabList, TabPanel, TabPanels, Button } from "@headlessui/react";
import CustomizedTimeline from "./Timeline";
import HacktoberfestPr from "./HacktoberfestPr"; 

const handleLogout = () => {
  axios
    .get("http://localhost:5001/api/auth/logout", { withCredentials: true })
    .then((response) => {
      console.log(response.data.message); // For debugging purposes
      // After logout, redirect to the home or login page
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("Error during logout:", error);
    });
};

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({});
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [languagesData, setLanguagesData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/auth/user", { withCredentials: true })
      .then((response) => {
        setProfileData(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching profile data:", error));

    axios
      .get("http://localhost:5001/api/auth/social-accounts", { withCredentials: true })
      .then((response) => setSocialAccounts(response.data))
      .catch((error) => console.error("Error fetching social accounts:", error));

    axios
      .get("http://localhost:5001/api/auth/languages", { withCredentials: true })
      .then((response) => setLanguagesData(Array.isArray(response.data) ? response.data : [])) // Ensure it's an array
      .catch((error) => {
        console.error("Error fetching language data:", error);
        setLanguagesData([]); // Set to an empty array if there's an error
      });
  }, []);

  const getIconForProvider = (provider) => {
    switch (provider) {
      case "twitter":
        return faTwitter;
      case "instagram":
        return faInstagram;
      case "youtube":
        return faYoutube;
      case "twitch":
        return faTwitch;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] font-montserrat overflow-hidden">
      <nav className="flex justify-between items-center p-4 bg-black shadow-md fixed top-0 left-0 right-0">
        <span className="text-4xl pl-8">🦄</span>
        <Button
          className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white mr-6"
          onClick={handleLogout}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="bi bi-power w-5 h-5 mr-0">
            <path d="M7.5 1v7h1V1z" />
            <path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812" />
          </svg>
        </Button>
      </nav>

      <div className="pt-24 mx-4 h-[calc(100vh-4rem+3rem)] overflow-hidden flex gap-8">
        <div className="flex flex-col w-2/5 space-y-5 ml-4">
          <div className="bg-[#191919] backdrop-blur-lg rounded-3xl p-6 shadow-lg h-1/3">
            {loading ? (
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-gray-400 w-28 h-28 mb-4"></div>
                <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-400 rounded w-1/2 mb-4"></div>
                <div className="flex justify-around w-full mt-4 text-center text-gray-400">
                  <div className="h-4 bg-gray-400 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-400 rounded w-1/4"></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <img src={profileData.avatar_url} alt="Profile" className="rounded-full w-28 h-29 mb-4 border-2 border-[#30e48d]" />
                <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
                <p className="text-gray-500">@{profileData.login}</p>
                <div className="flex justify-around w-full mt-4 text-center text-white">
                  <div>
                    <p>Followers</p>
                    <p className="font-bold">{profileData.followers}</p>
                  </div>
                  <div>
                    <p>Following</p>
                    <p className="font-bold">{profileData.following}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#191919] backdrop-blur-lg rounded-3xl p-6 shadow-lg h-2/3">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-400 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-400 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-400 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-400 rounded w-3/4 mb-4"></div>
              </div>
            ) : (
              <div className="px-6">
                <h2 className="text-xl font-semibold text-white">About</h2>
                <hr className="my-2 bg-gray-500" />
                <p className="text-gray-300">{profileData.bio}</p>
                <h2 className="text-xl font-semibold text-white mt-6">Social Links</h2>
                <hr className="my-2 bg-gray-500" />
                {socialAccounts.length > 0 ? (
                  socialAccounts.map((account, index) => (
                    <a key={index} href={account.url} className="flex items-center space-x-2 text-gray-400">
                      <FontAwesomeIcon icon={getIconForProvider(account.provider)} />
                      <span>{account.provider.charAt(0).toUpperCase() + account.provider.slice(1)}</span>
                    </a>
                  ))
                ) : (
                  <p className="text-gray-500">No social accounts connected</p>
                )}
                {/* Languages Section */}
                <h2 className="text-xl font-semibold mt-6 text-white">Languages</h2>
                <hr className="my-2 bg-gray-500" />
                <LanguagesBar languagesData={languagesData} /> {/* Use LanguagesBar Component */}
              </div>
            )}
          </div>
        </div>

        {/* Main container */}
        <div className="w-3/5 mr-4 h-full">
          <div className="bg-[#191919] backdrop-blur-lg rounded-3xl p-10 shadow-lg w-full h-full flex flex-col">
            {" "}
            {/* flex and flex-col added */}
            <TabGroup defaultIndex={0} className="flex flex-col h-full">
              <TabList className="flex gap-4">
                {["Hacktoberfest", "Highlights"].map((category, index) => (
                  <Tab
                    key={index}
                    className="rounded-full py-2 px-4 text-sm font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5"
                  >
                    {category}
                  </Tab>
                ))}
              </TabList>
              <TabPanels className="mt-6 flex-1 overflow-hidden">
                {/* flex-1 and overflow-hidden ensures full height */}
                <TabPanel className="rounded-xl bg-white/5 p-4 h-full overflow-auto">
                  <HacktoberfestPr />
                </TabPanel>
                <TabPanel className="rounded-xl bg-white/5 p-4 h-full overflow-auto">
                  <CustomizedTimeline />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
