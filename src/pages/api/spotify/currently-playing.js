import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!jwt?.accessToken)
      return res.status(401).json({ error: "Not authenticated" });

    const r = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${jwt.accessToken}` },
        cache: "no-store",
      }
    );

    if (r.status === 204) {
      return res.status(204).end(); // nothing is currently playing
    }

    if (!r.ok) {
      throw new Error("Failed to fetch currently playing");
    }

    const data = await r.json();
    
    if (!data.item) {
      return res.status(204).end();
    }
    res.setHeader("Cache-Control", "no-store");

    return res.status(200).json({ 
      item: data.item,
      is_playing: data.is_playing,
      progress_ms: data.progress_ms,
    });
  } catch (error) {
    // Log error without sensitive data
    console.error("Currently playing API error:", error.message);
    res.status(500).json({ error: "Failed to fetch currently playing" });
  }
} 