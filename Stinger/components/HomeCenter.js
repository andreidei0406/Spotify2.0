import { playlistIdState } from "@/atoms/playlistAtoms";
import useSpotify from "@/hooks/useSpotify";
import { ChevronDownIcon, LogoutIcon } from "@heroicons/react/solid";
import { property, random, shuffle } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { selector, useRecoilState } from "recoil";
import Song from "./Song";
import { millisToMinutesAndSeconds } from "@/lib/time";

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
  const [party, setParty] = useState([]);
  const [topSongs, setTopSongs] = useState([]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getNewReleases({ limit: 6, offset: offset }).then((data) => {
        setNewAlbums(data.body?.albums.items);
      });
    }
  }, [spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getFeaturedPlaylists().then((data) => {
        setFeaturedPlaylists(data.body?.playlists.items);
      });
    }
  }, [spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylistsForCategory("chill", { limit: 6, offset: offset })
        .then((data) => {
          const playlists = [];
          data.body?.playlists.items.forEach((item) => {
            playlists.push(item);
          });
          playlists.forEach((item) => {
            item = item.description.split("<")[0];
          });
          setRecommendations(playlists);
        });

      spotifyApi
        .getPlaylistsForCategory("party", { limit: 6, offset: offset })
        .then((data) => {
          const playlists = [];
          data.body?.playlists.items.forEach((item) => {
            playlists.push(item);
          });
          playlists.forEach((item) => {
            item = item.description.split("<")[0];
          });
          setParty(playlists);
        });
    }
  }, [spotifyApi]);

  console.log(topSongs);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getRecommendations({
          seed_genres: ["party", "dance"],
          target_popularity: 70,
        })
        .then((data) => {
          console.log(data.body.tracks);
          setTopSongs(data.body.tracks);
        })
        .catch((err) => console.error(err));
    }
  }, [spotifyApi]);

  return (
    <div className="bg-slate-800 flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="hidden sm:inline-flex items-center bg-black space-x-3 opacity-90 
          hover:opacity-70 cursor-pointer rounded-full p-1 pr-2 text-white"
          onClick={signOut}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt=""
          />
          <h2>Log out</h2>
          <LogoutIcon className="h-5 w-5" />
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
        <div className="mt-5 ml-8">
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            Check out these new albums
          </h1>
        </div>
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

        <div className="">
          <div className="mt-5 ml-8">
            <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
              Take some time and chill
            </h1>
          </div>
          <div className="mt-5 mr-8 ">
            <h1 className="text-right text-2xl md:text-3xl xl:text-5xl font-bold">
              ...or get crazy
            </h1>
          </div>
        </div>
        <section className="grid grid-cols-2 gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xxs:gap-3 xs:gap-4 sm:gap-5 md:gap-7 py-4 px-8 max-w-[36rem] md:max-w-[56rem]">
            {recommendations.map((playlist) => (
              <div key={playlist.id} className="items-center rounded-lg">
                <img
                  className="relative xxs:w-22 xxs:h-22 xs:w-32 xs:h-32 md:w-34 md:h-34 lg:w-56 lg:h-56 xl:w-72 xl:h-72 2xl:w-96 2xl:h-96 shadow-2xl rounded-lg hover:opacity-75 cursor-pointer"
                  src={playlist?.images?.[0].url}
                  alt=""
                  onClick={() => {
                    router.push({
                      pathname: "/playlist/[id]",
                      query: { id: playlist.id },
                    });
                  }}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xxs:gap-3 xs:gap-4 sm:gap-5 md:gap-7 py-4 px-8 max-w-[36rem] md:max-w-[56rem]">
            {party.map((playlist) => (
              <div key={playlist.id} className="items-center rounded-lg">
                <img
                  className="relative xxs:w-22 xxs:h-22 xs:w-32 xs:h-32 md:w-34 md:h-34 lg:w-56 lg:h-56 xl:w-72 xl:h-72 2xl:w-96 2xl:h-96 shadow-2xl rounded-lg hover:opacity-75 cursor-pointer"
                  src={playlist?.images?.[0].url}
                  alt=""
                  onClick={() => {
                    router.push({
                      pathname: "/playlist/[id]",
                      query: { id: playlist.id },
                    });
                  }}
                />
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
                  <p className="hidden xs:flex overflow-hidden">
                    {playlist?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-5 ml-8">
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            Top songs right now
          </h1>
        </div>
        <section className="">
          <div className="">
            {topSongs.map((song, i) => (
              <div
                className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900
            rounded-lg cursor-pointer"
                // onDoubleClick={playSong}
                key={song.id}
              >
                <div className="flex items-center space-x-4">
                  <p>{i + 1}</p>
                  <img
                    className="h-10 w-10 xxs:w-8 xxs:h-8"
                    src={song?.album?.images?.[0]?.url}
                    alt=""
                  />
                  <div className="hidden xs:block">
                    <p className="w-36 md:w-64 lg:w-80 truncate text-white">
                      {song.name}
                    </p>
                    <p className="w-40">cineva</p>
                  </div>
                </div>

                <div className="hidden xs:flex items-center justify-between ml-auto md:ml-0">
                  <p className="w-40 hidden sm:inline">cinvea</p>
                  <p>{millisToMinutesAndSeconds(20000)}</p>
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
