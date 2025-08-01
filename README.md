jsx next.js nextauth.
read some docs but they supports tsx so i had to change some sytnax 

so technically i have two apis, front end is calling my own api route and that route is calling the actual api route calling spotify,  
and those two files are nearly identical BUT the actual api route calling spotify has the  

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
thats done because of security and front end not seeing the tokens

next.js and nextauth handles all the spotify login and it has a provider built in for spotify.  

what happens is when the user presses the connect w spotify the  

```js
export default function Home() {
  const handleLogin = () => {
    signIn("spotify", { callbackUrl: "/dashboard" });
  };
}
```
happens and does all the redirect shit and the stuff.  
then i define authoptions inside the pages/api/auth[...nextauth].js  

i import  

```js
import SpotifyProvider from "next-auth/providers/spotify";
```
first i made a function for getting the refresh token  
basically it does this  

```js
//refresh access token
//give a post request to spotify api to refresh access token
//gives the client_id:client_secret in base64
//then it gives back the same access token and refresh token
```

how it does it is by calling a post request to spotify  
sends grant type = refreshtoken  
sends refresh token  

spotify sends back a new access token and a new refresh token  


authOptions explanation 

providers: [SpotifyProvider(...)]

  this makes it support spotify out of box type shit 

secret: process.env.NEXTAUTH_SECRET

  used to encrypt and sign the jwt tokens and session cookies 

callbacks: { ... } 

  customize how tokens and sessions are handled 

jwt({ token, account }

  whenever a jwt token is created or updated

if user signs in for the first time, 
account is defined and 

  token.accessToken = account.access_token
  
  token.refreshToken = account.refresh_token
  
  token.expiresAt = account.expires_at * 1000 (converted to ms)


if token is valid just return if not call the refresh function i talked abt before 


async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
runs when a session is created or fetched (e.g. useSession() or getServerSession()).
it returns the correct, up-to-date access token for the current session, whether it's newly logged in or refreshed.

const session = await getServerSession(req, res, authOptions);

this basically does three parameter stuff 

req reads my cookie and finds the session token 

then it validates and encrypts it using next_auth_secret.

then it runs my jwt callback and sesison callback to ultimatley return session as session variable 












  



















