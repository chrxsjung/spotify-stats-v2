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

    const r = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=50`,
      {
        headers: { Authorization: `Bearer ${jwt.accessToken}` },
        cache: "no-store",
      }
    );

    if (!r.ok) throw new Error(`Failed to fetch artists: ${r.status}`);

    const data = await r.json();

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ artists: data.items });
  } catch (error) {
    console.error("Artists API error:", error);
    res.status(500).json({ error: "Failed to fetch artists" });
  }
}
