# next.js + nextauth + spotify flow

jsx next.js nextauth.  
read some docs but they supports tsx so i had to change some sytnax.

so technically i have two apis:  
- frontend is calling my own api route  
- that route is calling the actual api route (Spotify)  
and those two files are nearly identical BUT the actual api route calling spotify has the:

```js
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
```

that’s done because of security and frontend not seeing the tokens.

next.js and nextauth handles all the spotify login and it has a provider built in for spotify.

what happens is when the user presses the connect w spotify:

```js
export default function Home() {
  const handleLogin = () => {
    signIn("spotify", { callbackUrl: "/dashboard" });
  };
}
```

happens and does all the redirect shit and the stuff.  
then i define authoptions inside the `pages/api/auth/[...nextauth].js`  
i import:

```js
import SpotifyProvider from "next-auth/providers/spotify";
```

how it does it is by calling a post request to spotify:  
- sends `grant_type = refresh_token`  
- sends `refresh_token`  
- spotify sends back a new access token and a new refresh token  

---

## authOptions explanation

### providers: [SpotifyProvider(...)]

this makes it support spotify out of box type shit.

### secret: process.env.NEXTAUTH_SECRET

used to encrypt and sign the jwt tokens and session cookies.

### callbacks: { ... }

customize how tokens and sessions are handled.

---

### jwt({ token, account })

whenever a jwt token is created or updated:

if user signs in for the first time,  
account is defined and:

```js
token.accessToken = account.access_token  
token.refreshToken = account.refresh_token  
token.expiresAt = account.expires_at * 1000 // (converted to ms)
```

if token is valid just return  
if not call the refresh function i talked abt before.

---

### async session({ session, token })

```js
session.accessToken = token.accessToken;
return session;
```

runs when a session is created or fetched (e.g. `useSession()` or `getServerSession()`).  
it returns the correct, up-to-date access token for the current session, whether it's newly logged in or refreshed.

---

# how `getServerSession()` works in my next.js + nextauth spotify app

## step-by-step flow

### 1. user logs in with spotify
- the frontend calls `signIn("spotify")`
- nextauth handles the oauth redirect flow
- on success, nextauth stores:
  - `access_token`
  - `refresh_token`
  - `expires_at`
- these values are saved inside a jwt (json web token)
- the jwt is sent to the client in an `httponly` cookie (e.g. `next-auth.session-token`)
- this cookie is signed and encrypted using `nextauth_secret`

---

### 2. user makes a request to my api route
- the frontend calls one of my internal api routes, for example:
  ```js
  fetch("/api/spotify/top-artists");
  ```
- this request automatically includes the session cookie

---

### 3. api route calls `getServerSession(req, res, authOptions)`
- inside the api route:
  ```js
  const session = await getServerSession(req, res, authOptions);
  ```
- `getServerSession` does the following:
  - reads the session token (jwt) from the request cookies
  - validates and decrypts the jwt using `nextauth_secret`
  - reconstructs the session by running the configured `jwt()` and `session()` callbacks

---

### 4. the session object contains the real spotify access token
- from the `jwt()` callback, the `accessToken`, `refreshToken`, and `expiresAt` were stored in the jwt
- from the `session()` callback, the `accessToken` is attached to the session object returned by `getServerSession`

---

### 5. backend uses the access token to call the spotify api
- using the session’s access token, the backend makes a secure request to the spotify api:

```js
const response = await fetch("https://api.spotify.com/v1/me/top/artists", {
  headers: {
    authorization: `Bearer ${session.accessToken}`,
  },
});
```

- the access token is never exposed to the frontend

---

## summary

- the frontend never sees or handles access tokens directly  
- tokens are stored in a signed, encrypted jwt sent as an `httponly` cookie  
- internal api routes use `getServerSession()` to securely access and validate the session  
- spotify api calls are made from the backend using the validated access token
