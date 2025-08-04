import RecentlyPlayed from "./RecentlyPlayed.jsx";
import { getRecentlyPlayed } from "../../utils/spotify.js";
import { useState, useEffect } from "react";

function RecentlyPlayedCard() {
  const [recentlyPlayed, setRecentlyPlayed] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecentlyPlayed = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRecentlyPlayed(50, false);
      setRecentlyPlayed(data);
    } catch (err) {
      console.error("❌ Failed to load recently played tracks:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentlyPlayed();

    // Update recently played data every 2 minutes (120,000 ms)
    const interval = setInterval(() => {
      fetchRecentlyPlayed();
    }, 120000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchRecentlyPlayed();
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Recently Played</h2>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm px-3 py-2 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          disabled={loading}
        >
          {loading ? "⟳" : "↻"}
        </button>
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
            <p className="font-semibold">Failed to load tracks</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          recentlyPlayed &&
          recentlyPlayed.length === 0 && (
            <div className="text-gray-400 text-center py-8">
              <p>No recently played tracks found</p>
              <p className="text-sm">Start listening to some music!</p>
            </div>
          )}

        {recentlyPlayed?.map((item, index) => (
          <RecentlyPlayed
            key={`${item?.track?.id || "track"}-${index}`}
            track={item.track}
            playedAt={item.played_at}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export default RecentlyPlayedCard;
