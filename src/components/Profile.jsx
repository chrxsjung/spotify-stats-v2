import { getUserProfile } from "../utils/spotify.js";
import { useState, useEffect } from "react";
import PlayingNow from "./PlayingNow.jsx";

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        setUserProfile(data);
      })
      .catch((err) => {
        console.error("❌ Failed to load profile:", err.message);
        setError(err.message);
      });
  }, []);

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg p-8 text-white">
      <div className="flex flex-col xl:flex-row items-center xl:items-start space-y-6 xl:space-y-0 xl:space-x-8">
        <div className="flex flex-col xs:flex-row items-center space-y-6 xs:space-y-0 xs:space-x-8 flex-1 xs:justify-center">
          <div className="relative">
            <img
              src={userProfile?.images[0]?.url}
              alt="Profile"
              className="w-32 h-32 xs:w-40 xs:h-40 rounded-full object-cover border-4 border-gray-700 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">
              PREMIUM
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center xs:text-left">
            <h2 className="text-2xl xs:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mt-6">
              {userProfile?.display_name}
            </h2>

            {/* Stats */}
            <div className="mt-10 flex flex-col xs:flex-row items-center xs:items-start justify-center xs:justify-start">
              <div className="bg-black/30 rounded-lg p-3 inline-block mr-0 xs:mr-2 mb-2 xs:mb-0">
                <p className="text-2xl font-bold text-green-400">
                  {userProfile?.followers
                    ? userProfile.followers.toLocaleString()
                    : "0"}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Followers
                </p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 inline-block">
                <p className="text-2xl font-bold text-green-400">
                  {userProfile?.country}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Country
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Playing Now Component */}
        <div className="w-full xl:w-[700px]">
          <PlayingNow />
        </div>
      </div>
    </div>
  );
}

export default Profile;
