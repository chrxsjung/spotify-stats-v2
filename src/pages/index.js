// src/pages/index.js
import { signIn } from "next-auth/react";

export default function Home() {
  const handleLogin = () => {
    signIn("spotify", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center bg-gradient-to-br from-green-900 via-black to-green-800">
      <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-6">
        <div className="mb-2">
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg
              className="w-24 h-24 text-black"
              fill="green"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight pb-3">
          Spotify Stats
        </h1>

        <p className="text-xl text-gray-400 font-medium mb-12 max-w-md">
  your personal music analytics dashboard. to request access, please email me first — spotify limits access to just 25 users.
</p>


        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Connect with Spotify
        </button>

        <p className="text-sm text-gray-500 mt-8 max-w-sm">
          Discover your listening habits, favorite artists, and music trends.
          More features to come!
        </p>
      </div>
    </div>
  );
}
