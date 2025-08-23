import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!jwt?.accessToken)
      return res.status(401).json({ error: "Not authenticated" });

    const { time_range = "long_term" } = req.query;

    // Validate time_range parameter
    const validTimeRanges = ["short_term", "medium_term", "long_term"];
    if (!validTimeRanges.includes(time_range)) {
      return res.status(400).json({ error: "Invalid time_range parameter" });
    }

    const r = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=50`,
      {
        headers: { Authorization: `Bearer ${jwt.accessToken}` },
        cache: "no-store",
      }
    );

    if (!r.ok) {
      throw new Error("Failed to fetch genres");
    }

    const data = await r.json();

    const allGenres = data.items.flatMap((artist) => artist.genres);
    const uniqueGenres = [...new Set(allGenres)];

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ items: data.items, genres: uniqueGenres });
  } catch (error) {
    // Log error without sensitive data
    console.error("Genres API error:", error.message);
    res.status(500).json({ error: "Failed to fetch genres" });
  }
}
