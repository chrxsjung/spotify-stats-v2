import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { time_range = "long_term" } = req.query;

    const response = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch artists: ${response.status}`);
    }

    const data = await response.json();

    res.status(200).json({
      artists: data.items,
    });
  } catch (error) {
    console.error("Artists API error:", error);
    res.status(500).json({ error: "Failed to fetch artists" });
  }
}
