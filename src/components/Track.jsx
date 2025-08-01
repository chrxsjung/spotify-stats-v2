function Track({ track, index }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 hover:bg-black/10 rounded-lg transition-colors duration-200 border-b border-gray-700/50 last:border-b-0">
      <div className="flex items-center space-x-4">
        <span className="text-gray-400 w-6 text-right font-mono text-sm">
          {index + 1}.
        </span>
        <img
          src={track.album.images[0]?.url}
          alt={`Album art for ${track.name}`}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-700"
        />
      </div>
      <div className="flex-1 min-w-0 sm:ml-0 ml-10">
        <h3 className="text-white font-semibold truncate">{track.name}</h3>
        <p className="text-gray-400 text-sm truncate">
          {track.artists.map((artist) => artist.name).join(", ")}
        </p>
        <p className="text-gray-500 text-xs truncate">{track.album.name}</p>
      </div>
      <div className="text-left sm:text-right sm:ml-0 ml-10">
        <span className="text-white text-sm font-medium">
          Popularity:{" "}
          <span className="text-green-400">{track.popularity}%</span>
        </span>
      </div>
    </div>
  );
}

export default Track;
