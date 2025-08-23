import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

async function refreshAccessToken(token) {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error_description || "Failed to refresh access token");
    }

    return {
      ...token,
      accessToken: data.access_token,
      tokenType: data.token_type || token.tokenType || "Bearer",
      expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
      refreshToken: data.refresh_token ?? token.refreshToken, // keep old if missing
      error: undefined,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions = {
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "user-top-read user-read-email user-read-recently-played user-read-currently-playing user-read-playback-state user-read-private",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Initial sign-in
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          tokenType: account.token_type || "Bearer",
          // use expires_in (seconds from now)
          expiresAt: Date.now() + (account.expires_in ?? 3600) * 1000,
        };
      }

      if (token.expiresAt && Date.now() < token.expiresAt - 30_000) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      // don’t expose tokens; surface error for UI handling
      session.error = token.error || null;
      return session;
    },
  },
};

export default NextAuth(authOptions);
