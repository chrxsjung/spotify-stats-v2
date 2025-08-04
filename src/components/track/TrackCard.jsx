import Track from "./Track.jsx";
import { getSpotifyTracks } from "../../utils/spotify.js";
import { useState, useEffect } from "react";

function TrackCard() {
  const [userTracks, setUserTracks] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("long_term");

  useEffect(() => {
    setLoading(true);
    getSpotifyTracks(timeRange)
      .then((data) => {
        setUserTracks(data);
        setError(null);
      })
      .catch((err) => {
        console.error("❌ Failed to load tracks:", err.message);
        setError(err.message);
        setUserTracks([]);
      })
      .finally(() => setLoading(false));
  }, [timeRange]);

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Top Tracks</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange("long_term")}
            className={`font-bold text-sm px-3 py-2 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
              timeRange === "long_term"
                ? "bg-green-500 text-black"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeRange("short_term")}
            className={`font-bold text-sm px-3 py-2 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
              timeRange === "short_term"
                ? "bg-green-500 text-black"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Last Month
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col max-h-96 overflow-y-auto space-y-1 pr-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-center py-4">
            Failed to load tracks: {error}
          </div>
        )}

        {userTracks?.tracks?.map((track, index) => (
          <Track key={track.id} track={track} index={index} />
        ))}
      </div>
    </div>
  );
}

export default TrackCard;
