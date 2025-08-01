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

    const { limit = 50 } = req.query;
    
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recently played");
    }

    const data = await response.json();
    
    res.status(200).json({
      items: data.items,
    });
  } catch (error) {
    console.error("Recently played API error:", error);
    res.status(500).json({ error: "Failed to fetch recently played" });
  }
}
