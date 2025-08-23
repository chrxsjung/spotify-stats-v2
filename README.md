# spotify stats – auth and api flow

this project uses next.js + nextauth.js (spotify provider) to securely authenticate users with spotify and fetch their listening data.

## authentication flow

1. user login  
   - frontend calls `signIn("spotify")`.  
   - user is redirected to spotify’s oauth 2.0 login/consent screen.  
   - spotify returns an `access_token`, `refresh_token`, and expiry time.  

2. jwt sessions  
   - nextauth stores these tokens inside a signed httponly jwt cookie (`next-auth.session-token`).  
   - tokens are never exposed to the frontend.  

3. jwt callback  
   - on initial sign-in, tokens are saved in the jwt payload.  
   - on subsequent requests, if the token is expired, nextauth calls a custom `refreshAccessToken()` function to renew it using the `refresh_token`.  

4. session callback  
   - public session data (like user profile info) is returned to the client.  
   - access and refresh tokens are never included — they stay server-only.  

## api request flow

1. frontend request  
   - example: `fetch("/api/spotify/top-artists?time_range=long_term")`  

2. next.js api route  
   - api route calls `getToken({ req })` to securely read the jwt from the httponly cookie.  
   - extracts the latest `accessToken` from the jwt.  

3. spotify api call  
   - api route uses `accessToken` to fetch data from spotify (`/v1/me/...`).  
   - example:  
     ```js
     const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
     const r = await fetch("https://api.spotify.com/v1/me/top-artists", {
       headers: { authorization: `bearer ${jwt.accessToken}` },
     });
     ```

4. response to client  
   - the serverless api route sends back only the necessary json (artists, tracks, genres, etc.).  
   - tokens are never returned to the client.  

## security highlights

- jwt strategy: sessions are stored as signed cookies, not in a database  
- httponly cookies: tokens are never available to frontend javascript  
- proxy api design: frontend only talks to `/api/spotify/*` routes, which handle token management internally  
- auto-refresh: expired tokens are refreshed via the custom refresh function  
- re-login fallback: if refresh fails (for example a revoked token), the client can trigger a new `signIn("spotify")`  
