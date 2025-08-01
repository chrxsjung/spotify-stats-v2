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

    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (response.status === 204) {
      return res.status(204).end(); // nothing is currently playing
    }

    if (!response.ok) {
      throw new Error("Failed to fetch currently playing");
    }

    const data = await response.json();
    
    if (!data.item) {
      return res.status(204).end();
    }

    res.status(200).json({
      item: data.item,
      is_playing: data.is_playing,
      progress_ms: data.progress_ms,
    });
  } catch (error) {
    console.error("Currently playing API error:", error);
    res.status(500).json({ error: "Failed to fetch currently playing" });
  }
} 