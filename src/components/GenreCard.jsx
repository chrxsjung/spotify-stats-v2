import { getUserGenres } from "../utils/spotify.js";
import { useState, useEffect } from "react";

function GenreCard() {
  const [userGenres, setUserGenres] = useState([]);
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
    getUserGenres(timeRange)
      .then((data) => {
        setUserGenres(data.genres);
        setError(null);
      })
      .catch((err) => {
        console.error("❌ Failed to load genres:", err.message);
        setError(err.message);
        setUserGenres([]);
      })
      .finally(() => setLoading(false));
  }, [timeRange]);

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Top Genres</h2>
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

      <div className="flex flex-col max-h-96 overflow-y-auto space-y-1 pr-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-center py-4">
            Failed to load genres: {error}
          </div>
        )}

        {!loading && !error && userGenres.length === 0 && (
          <div className="text-gray-400 text-center py-4">No genres found.</div>
        )}

        {!loading && !error && userGenres.length > 0 && (
          <div className="space-y-3 mt-4">
            {userGenres.map((genre, index) => (
              <div
                key={index}
                className="bg-black/30 rounded-lg p-3 hover:bg-black/40 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="capitalize text-white font-medium text-lg">
                    {genre}
                  </span>
                  <span className="text-green-400 text-sm font-bold">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GenreCard;
