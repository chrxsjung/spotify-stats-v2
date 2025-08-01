export async function getUserProfile() {
  const res = await fetch("/api/spotify/profile", {
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch user profile");
  }

  const data = await res.json();

  return {
    display_name: data.display_name,
    country: data.country,
    followers: data.followers,
    images: data.images,
  };
}

export async function getSpotifyArtists(timeRange = "long_term") {
  const res = await fetch(`/api/spotify/artists?time_range=${timeRange}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch user's top artists");
  }

  const data = await res.json();

  return {
    artists: data.artists,
  };
}

export async function getSpotifyTracks(timeRange = "long_term") {
  const res = await fetch(`/api/spotify/tracks?time_range=${timeRange}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch user's top tracks");
  }
  const data = await res.json();

  return {
    tracks: data.items,
  };
}

export async function getCurrentlyPlaying() {
  const res = await fetch(`/api/spotify/currently-playing`, {
    credentials: "include",
  });

  if (res.status === 204) {
    return null; // nothing is currently playing
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error || "Failed to fetch currently playing track"
    );
  }

  const data = await res.json();

  if (!data.item) {
    return null;
  }

  return {
    name: data.item.name,
    artist: data.item.artists.map((artist) => artist.name).join(", "),
    album: data.item.album.name,
    image: data.item.album.images[0]?.url,
    isPlaying: data.is_playing,
    progress: data.progress_ms,
    duration: data.item.duration_ms,
    trackId: data.item.id,
    albumId: data.item.album.id,
    artistIds: data.item.artists.map((artist) => artist.id),
  };
}

export async function getUserGenres(timeRange = "long_term") {
  const res = await fetch(`/api/spotify/genre?time_range=${timeRange}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch user's genres");
  }

  const data = await res.json();

  return {
    genres: data.genres,
  };
}

export async function getRecentlyPlayed(limit = 50, filterDuplicates = false) {
  const res = await fetch(`/api/spotify/recent?limit=${limit}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error || "Failed to fetch user's recently played tracks"
    );
  }
  const data = await res.json();

  let items = data.items;

  //filter duplicates by track ID
  if (filterDuplicates) {
    const seen = new Set();
    items = items.filter((item) => {
      const trackId = item.track?.id;
      if (seen.has(trackId)) return false;
      seen.add(trackId);
      return true;
    });
  }

  return items;
}
