import { useState, useEffect } from "react";
import { getCurrentlyPlaying } from "../utils/spotify.js";

function PlayingNow() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [error, setError] = useState(null);

  const fetchCurrentlyPlaying = async () => {
    try {
      setError(null);
      const trackData = await getCurrentlyPlaying();
      setCurrentTrack(trackData);
    } catch (err) {
      console.error("❌ Failed to fetch currently playing:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCurrentlyPlaying();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchCurrentlyPlaying, 5000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Now Playing</h3>
        </div>
        <div className="text-red-400 text-sm">Error loading track: {error}</div>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Now Playing</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <span className="text-xs text-gray-400">Not Playing</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-gray-400 text-sm">No track currently playing</p>
            <p className="text-gray-500 text-xs">
              Start playing something on Spotify
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Now Playing</h3>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              currentTrack.isPlaying
                ? "bg-green-400 animate-pulse"
                : "bg-gray-500"
            }`}
          ></div>
          <span className="text-xs text-gray-400">
            {currentTrack.isPlaying ? "Playing" : "Paused"}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={currentTrack.image}
            alt={`Album art for ${currentTrack.name}`}
            className="w-16 h-16 rounded-lg object-cover shadow-lg"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium truncate">
            {currentTrack.name}
          </h4>
          <p className="text-gray-400 text-sm truncate">
            {currentTrack.artist}
          </p>
          <p className="text-gray-500 text-xs truncate">{currentTrack.album}</p>
        </div>
      </div>
    </div>
  );
}

export default PlayingNow;
