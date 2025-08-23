import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const { limit = 50 } = req.query;

    if (!jwt?.accessToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Validate limit parameter
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ error: "Invalid limit parameter (1-50)" });
    }

    const r = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=${limitNum}`,
      {
        headers: { Authorization: `Bearer ${jwt.accessToken}` },
        cache: "no-store",
      }
    );

    if (!r.ok) {
      throw new Error("Failed to fetch recently played");
    }

    const data = await r.json();

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ items: data.items });
  } catch (error) {
    // Log error without sensitive data
    console.error("Recently played API error:", error.message);
    res.status(500).json({ error: "Failed to fetch recently played" });
  }
}
