import { playlistIdState } from "@/atoms/playlistAtoms";
import useSpotify from "@/hooks/useSpotify";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { property, random, shuffle } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { selector, useRecoilState } from "recoil";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];
const offset = random(50, false);

function HomeCenter() {
  const router = useRouter();
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [newAlbums, setNewAlbums] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getNewReleases({ limit: 6, offset: offset }).then((data) => {
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

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylistsForCategory("chill", { limit: 6, offset: offset })
        .then((data) => {
          const playlists = [];
          data.body.playlists.items.forEach((item) => {
            playlists.push(item);
          });
          playlists.forEach((item) => {
            item = item.description.split("<")[0];
          });
          setRecommendations(playlists);
        });
    }
  }, [session, spotifyApi]);

  console.log(recommendations);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="relative">
        <div
          className="absolute hidden sm:flex top-5 right-8 items-center bg-black space-x-3 opacity-90 
    hover:opacity-70 cursor-pointer rounded-full text-white"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xxs:gap-3 xs:gap-4 sm:gap-5 md:gap-7 py-4 px-8">
            {newAlbums.map((album) => (
              <div
                key={album.id}
                className="flex items-center xs:bg-slate-500 hover:opacity-75 rounded-lg cursor-pointer"
                onClick={() => {
                  router.push({
                    pathname: "/album/[id]",
                    query: { id: album.id },
                  });
                }}
              >
                <img
                  className="relative xxs:w-22 xxs:h-22 xs:w-32 xs:h-32 md:w-24 md:h-24 lg:w-40 lg:h-40 xl:w-50 xl:h-50 2xl:w-58 2xl:h-58 shadow-2xl rounded-lg hover:opacity-75 cursor-pointer"
                  src={album?.images?.[0].url}
                  alt=""
                />
                <div>
                  <h1 className="hidden xs:flex text-sm md:text-lg xl:text-xl font-bold">
                    {album?.name}
                  </h1>
                  <p className="hidden xs:flex">
                    New album by {album?.artists?.[0].name}
                  </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xxs:gap-3 xs:gap-4 sm:gap-5 md:gap-7 py-4 px-8">
            {featuredPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center bg-slate-500 hover:opacity-75 rounded-lg cursor-pointer"
                onClick={() => {
                  router.push({
                    pathname: "/playlist/[id]",
                    query: { id: playlist.id },
                  });
                }}
              >
                <img
                  className="relative xxs:w-22 xxs:h-22 xs:w-32 xs:h-32 md:w-24 md:h-24 lg:w-40 lg:h-40 xl:w-50 xl:h-50 2xl:w-58 2xl:h-58 shadow-2xl rounded-lg hover:opacity-75 cursor-pointer"
                  src={playlist?.images?.[0].url}
                  alt=""
                />
                <div>
                  <h1 className="hidden xs:flex text-sm md:text-lg xl:text-xl font-bold">
                    {playlist?.name}
                  </h1>
                  <p className="hidden xs:flex">{playlist?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-5 ml-8">
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            Take some time and chill
          </h1>
        </div>
        <section className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xxs:gap-3 xs:gap-4 sm:gap-5 md:gap-7 py-4 px-8">
            {recommendations.map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center bg-slate-500 hover:opacity-75 rounded-lg cursor-pointer"
                onClick={() => {
                  router.push({
                    pathname: "/playlist/[id]",
                    query: { id: playlist.id },
                  });
                }}
              >
                <img
                  className="relative xxs:w-22 xxs:h-22 xs:w-32 xs:h-32 md:w-24 md:h-24 lg:w-40 lg:h-40 xl:w-50 xl:h-50 2xl:w-58 2xl:h-58 shadow-2xl rounded-lg hover:opacity-75 cursor-pointer"
                  src={playlist?.images?.[0].url}
                  alt=""
                />
                <div>
                  <h1 className="hidden xs:flex text-sm md:text-lg xl:text-xl font-bold">
                    {playlist?.name}
                  </h1>
                  <p className="hidden xs:flex">{playlist?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="flex items-end space-x-7 bg-gradient-to-b  h-80 text-white p-8"></section>
    </div>
  );
}

export default HomeCenter;
