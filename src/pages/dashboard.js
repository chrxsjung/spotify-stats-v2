import Profile from "@/components/Profile";
import ArtistCard from "@/components/ArtistCard";
import GenreCard from "@/components/GenreCard";
import TrackCard from "@/components/TrackCard";
import RecentlyPlayedCard from "@/components/RecentlyPlayedCard";
import LogoutButton from "@/components/Logout.jsx";

function Dashboard() {
  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-black"
                  fill="green"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Spotify Stats
              </h1>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome to your Dashboard!
          </h2>
          <p className="text-gray-400">
            Your music analytics and insights will appear here
          </p>
        </div>

        {/* responsive grid. this is why i love tailwind now FUCK MEDIA QUERY */}

        <Profile />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-8">
          <ArtistCard />
          <TrackCard />
          <GenreCard />
          <RecentlyPlayedCard />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
