import Artist from "./Artist.jsx";
import { getSpotifyArtists } from "../../utils/spotify.js";
import { useState, useEffect } from "react";

function ArtistCard() {
  const [userArtists, setUserArtists] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("long_term");

  /*
   * STATE-DRIVEN RE-RENDERING LOGIC:
   *
   * 1. timeRange is stored in useState (starts as "long_term")
   * 2. when a button is clicked, setTimeRange() is called
   * 3. this changes the timeRange state value
   * 4. because timeRange is in the useEffect dependency array [timeRange]
   * 5. the useEffect automatically runs again with the new timeRange value
   * 6. this triggers a new API call and re-renders the component with fresh data
   *
   * flow: button click → setTimeRange() → state change → useEffect runs → new data
   */
  useEffect(() => {
    setLoading(true);
    getSpotifyArtists(timeRange)
      .then((data) => {
        setUserArtists(data);
        setError(null);
      })
      .catch((err) => {
        console.error("❌ Failed to load artists:", err.message);
        setError(err.message);
        setUserArtists([]);
      })
      .finally(() => setLoading(false));
  }, [timeRange]);

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-gray-800 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Top Artists</h2>
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
            Failed to load artists: {error}
          </div>
        )}

        {userArtists?.artists?.map((artist, index) => (
          <Artist key={artist.id} artist={artist} index={index} />
        ))}
      </div>
    </div>
  );
}

export default ArtistCard;
