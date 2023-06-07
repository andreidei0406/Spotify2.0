import { playlistIdState } from "@/atoms/playlistAtoms";
import useSpotify from "@/hooks/useSpotify";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { shuffle } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function HomeCenter() {
  const router = useRouter();
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [newAlbums, setNewAlbums] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);

  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getNewReleases({ limit: 6 }).then((data) => {
        setNewAlbums(data.body.albums.items);
      });
    }
  }, [session, spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getFeaturedPlaylists().then((data) => {
        setFeaturedPlaylists(data.body.playlists.items);
      });
    }
  }, [session, spotifyApi]);

  console.log(newAlbums);
  console.log(featuredPlaylists);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-black space-x-3 opacity-90 
    hover:opacity-70 cursor-pointer rounded-full p-1 pr-2 text-white"
          onClick={signOut}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt=""
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <header>
        <div className="mt-5 ml-8">
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            Hello {session?.user.name}
          </h1>
        </div>
      </header>
      <div>
        <section className="">
          <div className="grid grid-cols-3 space-x-4 space-y-4 py-4 px-8">
            {newAlbums.map((album) => (
              <div
                className="flex items-center bg-gray-500 hover:opacity-75 rounded-lg cursor-pointer"
                onClick={() => {
                  router.push({
                    pathname: "/album/[id]",
                    query: { id: album.id },
                  });
                }}
              >
                <img
                  className="w-32 h-32 shadow-2xl rounded-sm"
                  src={album?.images?.[0].url}
                  alt=""
                />
                <div>
                  <p>Album</p>
                  <h1 className="text-md md:text-lg xl:text-xl font-bold">
                    {album?.name}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-5 ml-8">
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            Featured Playlists
          </h1>
        </div>
        <section className="">
          <div className="grid grid-cols-3 space-x-4 space-y-4 py-4 px-8">
            {featuredPlaylists.map((playlist) => (
              <div
                className="flex items-center bg-gray-500 hover:opacity-75 rounded-lg cursor-pointer"
                onClick={() => {
                  router.push({
                    pathname: "/playlist/[id]",
                    query: { id: playlist.id },
                  });
                }}
              >
                <img
                  className="w-32 h-32 shadow-2xl rounded-sm"
                  src={playlist?.images?.[0].url}
                  alt=""
                />
                <div>
                  <p>Playlist</p>
                  <h1 className="text-md md:text-lg xl:text-xl font-bold">
                    {playlist?.name}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* <section className="">
          <div className="grid grid-cols-3 space-x-4 space-y-4 py-4 px-8">
            {featuredPlaylists.map((playlist) => (
              <div className="flex items-center bg-gray-500 hover:opacity-75 rounded-lg cursor-pointer">
                <img
                  className="w-32 h-32 shadow-2xl rounded-sm"
                  src={playlist?.images?.[0].url}
                  alt=""
                />
                <div>
                  <p>Playlist</p>
                  <h1 className="text-md md:text-lg xl:text-xl font-bold">
                    {playlist?.name}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </section> */}
      </div>
      <section className="flex items-end space-x-7 bg-gradient-to-b  h-80 text-white p-8"></section>
    </div>
  );
}

export default HomeCenter;
