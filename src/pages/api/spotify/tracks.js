import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { time_range = "long_term" } = req.query;

    if (!jwt?.accessToken)
      return res.status(401).json({ error: "Not authenticated" });

    const r = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=50`,
      {
        headers: { Authorization: `Bearer ${jwt.accessToken}` },
        cache: "no-store",
      }
    );

    if (!r.ok) {
      throw new Error("Failed to fetch tracks");
    }

    const data = await r.json();

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ items: data.items });
  } catch (error) {
    console.error("Tracks API error:", error);
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
}
