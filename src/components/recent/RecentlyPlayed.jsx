function RecentlyPlayed({ track, playedAt, index }) {
  const imageUrl = track?.album?.images?.[0]?.url || "/placeholder.png";

  const formatPlayedAt = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 hover:bg-black/10 rounded-lg transition-colors duration-200 border-b border-gray-700/50 last:border-b-0">
      <div className="flex items-center space-x-4">
        <span className="text-gray-400 w-6 text-right font-mono text-sm">
          {index + 1}.
        </span>
        <img
          src={imageUrl}
          alt={`Album art for ${track?.name || "Unknown Track"}`}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-700"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0 sm:ml-0 ml-10">
        <h3 className="text-white font-semibold truncate" title={track?.name}>
          {track?.name || "Untitled"}
        </h3>
        <p className="text-gray-400 text-sm truncate">
          {(track?.artists || []).map((artist) => artist.name).join(", ") ||
            "Unknown Artist"}
        </p>
        <div className="flex items-center space-x-2 text-xs">
          <p className="text-gray-500 truncate">
            {track?.album?.name || "Unknown Album"}
          </p>
          {playedAt && (
            <>
              <span className="text-gray-600">•</span>
              <p className="text-green-400 font-medium">
                {formatPlayedAt(playedAt)}
              </p>
            </>
          )}
        </div>
      </div>
      <div className="text-left sm:text-right sm:ml-0 ml-10">
        <span className="text-white text-sm font-medium">
          Popularity:{" "}
          <span className="text-green-400">{track?.popularity ?? "?"}%</span>
        </span>
      </div>
    </div>
  );
}

export default RecentlyPlayed;
