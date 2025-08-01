## Architecture Flow

```
User Login → NextAuth.js → Session Cookies → Frontend Components → Utility Functions → API Routes → Spotify API
```

---

## 1. Authentication Flow (NextAuth.js)

### 1.1 Initial Login Process

**File:** `src/pages/index.js`

```javascript
const handleLogin = () => {
  signIn("spotify", { callbackUrl: "/dashboard" });
};
```

**What happens:**

1. User clicks "Connect with Spotify" button
2. `signIn("spotify")` redirects to Spotify OAuth authorization URL
3. User authorizes the application on Spotify
4. Spotify redirects back to NextAuth callback with authorization code
5. NextAuth exchanges code for access/refresh tokens
6. User is redirected to `/dashboard`

### 1.2 NextAuth Configuration

**File:** `src/pages/api/auth/[...nextauth].js`

```javascript
export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-top-read user-read-email",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at * 1000;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};
```

**What happens:**

1. **JWT Callback**: Stores Spotify access token, refresh token, and expiration in JWT
2. **Session Callback**: Makes access token available in session object
3. **Session Storage**: NextAuth stores encrypted session data in HTTP-only cookies

### 1.3 Session Management

**File:** `src/pages/_app.js`

```javascript
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
```

**What happens:**

- `SessionProvider` wraps the entire app
- Provides session context to all components
- Handles session state management

---

## 2. Frontend Component Flow

### 2.1 Dashboard Component

**File:** `src/pages/dashboard.js`

```javascript
function Dashboard() {
  return (
    <div>
      <Profile />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ArtistCard />
        <TrackCard />
        <GenreCard />
        <RecentlyPlayedCard />
      </div>
    </div>
  );
}
```

**What happens:**

1. Dashboard renders various card components
2. Each card component calls utility functions to fetch data
3. Components handle loading states and error handling

### 2.2 Component Data Fetching

**File:** `src/components/Profile.jsx`

```javascript
import { getUserProfile } from "../utils/spotify.js";

function Profile() {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        setUserProfile(data);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err.message);
      });
  }, []);

  // Render profile data...
}
```

**What happens:**

1. Component imports utility function
2. `useEffect` calls utility function on component mount
3. Utility function returns promise with data
4. Component updates state with fetched data
5. Component re-renders with new data

---

## 3. Utility Functions (Middleware Layer)

### 3.1 Utility Function Structure

**File:** `src/utils/spotify.js`

```javascript
export async function getUserProfile() {
  const res = await fetch("/api/spotify/profile", {
    credentials: "include", // Sends session cookies
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch user profile");
  }

  const data = await res.json();
  return {
    display_name: data.display_name,
    country: data.country,
    followers: data.followers?.total,
    images: data.images,
  };
}
```

**What happens:**

1. **HTTP Request**: Makes fetch request to internal API route
2. **Cookie Transmission**: `credentials: "include"` sends session cookies
3. **Error Handling**: Checks response status and handles errors
4. **Data Transformation**: Transforms API response to component-friendly format
5. **Promise Return**: Returns promise that resolves with processed data

### 3.2 Available Utility Functions

- `getUserProfile()` → `/api/spotify/profile`
- `getSpotifyArtists(timeRange)` → `/api/spotify/artists`
- `getSpotifyTracks(timeRange)` → `/api/spotify/tracks`
- `getCurrentlyPlaying()` → `/api/spotify/currently-playing`
- `getUserGenres(timeRange)` → `/api/spotify/genre`
- `getRecentlyPlayed(limit)` → `/api/spotify/recent`

---

## 4. API Routes (Server-Side Middleware)

### 4.1 API Route Structure

**File:** `src/pages/api/spotify/artists.js`

```javascript
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1. Validate session
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // 2. Extract query parameters
    const { time_range = "long_term" } = req.query;

    // 3. Call Spotify API
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch artists");
    }

    // 4. Return processed data
    const data = await response.json();
    res.status(200).json({
      artists: data.items,
    });
  } catch (error) {
    console.error("Artists API error:", error);
    res.status(500).json({ error: "Failed to fetch artists" });
  }
}
```

### 4.2 API Route Flow

**Step-by-step process:**

1. **Request Validation**

   - Check HTTP method (GET, POST, etc.)
   - Return 405 if method not allowed

2. **Session Authentication**

   - `getServerSession(req, res, authOptions)` extracts session from cookies
   - Validates session exists and is valid
   - Returns 401 if not authenticated

3. **Parameter Processing**

   - Extract query parameters from `req.query`
   - Set default values if parameters missing

4. **Spotify API Call**

   - Use `session.accessToken` for authorization
   - Make HTTP request to Spotify API
   - Handle Spotify API errors

5. **Response Processing**
   - Parse Spotify API response
   - Transform data if needed
   - Return JSON response to client

### 4.3 Available API Routes

- `/api/spotify/profile` - User profile information
- `/api/spotify/artists` - Top artists (with time_range parameter)
- `/api/spotify/tracks` - Top tracks (with time_range parameter)
- `/api/spotify/currently-playing` - Currently playing track
- `/api/spotify/genre` - User's music genres
- `/api/spotify/recent` - Recently played tracks

---

## 5. Security Implementation

### 5.1 Session Security

**Why this approach is secure:**

1. **Server-Side Sessions**: All authentication happens on server
2. **Encrypted Cookies**: Session data stored in encrypted HTTP-only cookies
3. **No Client Token Exposure**: Access tokens never exposed to client-side code
4. **Automatic Token Refresh**: NextAuth handles token refresh automatically
5. **CSRF Protection**: Built-in protection against cross-site request forgery

### 5.2 Token Flow

```
Spotify OAuth → NextAuth JWT → Encrypted Cookie → Server Session → Spotify API
```

1. **OAuth Flow**: User authorizes app, Spotify provides tokens
2. **JWT Storage**: NextAuth stores tokens in JWT with encryption
3. **Cookie Transmission**: JWT sent as encrypted cookie with requests
4. **Server Validation**: API routes validate session and extract tokens
5. **API Authorization**: Tokens used to authorize Spotify API calls

---

## 6. Error Handling

### 6.1 Frontend Error Handling

```javascript
useEffect(() => {
  getUserProfile()
    .then((data) => {
      setUserProfile(data);
    })
    .catch((err) => {
      console.error("Failed to load profile:", err.message);
      setError(err.message);
    });
}, []);
```

### 6.2 API Route Error Handling

```javascript
try {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // API logic...
} catch (error) {
  console.error("API error:", error);
  res.status(500).json({ error: "Failed to fetch data" });
}
```

### 6.3 Common Error Scenarios

1. **401 Unauthorized**: User not logged in or session expired
2. **403 Forbidden**: Invalid or expired access token
3. **429 Rate Limited**: Too many requests to Spotify API
4. **500 Server Error**: Internal server error or Spotify API error

---

## 7. Data Flow Summary

```
1. User Login
   ↓
2. NextAuth creates session (encrypted cookie)
   ↓
3. User visits dashboard
   ↓
4. Components call utility functions
   ↓
5. Utility functions make fetch requests to API routes
   ↓
6. API routes validate session and call Spotify API
   ↓
7. Spotify API returns data
   ↓
8. API routes process and return data
   ↓
9. Utility functions transform data
   ↓
10. Components receive and display data
```
