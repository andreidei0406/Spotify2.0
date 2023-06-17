import useSpotify from "@/hooks/useSpotify";
import { ChevronDownIcon, ChevronLeftIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
  "from-zinc-500",
  "from-amber-500",
  "from-emerald-500",
  "from-sky-500",
  "from-teal-500",
  "from-cyan-500",
  "from-rose-500",
  "from-fuchsia-500",
  "from-lime-500",
];

function CenterCategory() {
  const router = useRouter();
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const [category, setCategory] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState(null);
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [router.query.id]);

  useEffect(() => {
    spotifyApi
      .getCategory(router.query.id)
      .then((data) => {
        setCategory(data.body);
      })
      .catch((err) => console.log("Something went wrong!", err));
  }, [spotifyApi, session, router.query.id]);

  useEffect(() => {
    if (category) {
      spotifyApi
        .getPlaylistsForCategory(category?.id)
        .then((data) => {
          setPlaylists(data.body.playlists);
        })
        .catch((err) => console.log("Something went wrong!", err));
    }
  }, [spotifyApi, session, category]);

  console.log(playlists);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide pb-36">
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
      <header className="absolute top-5 left-8 ml-80">
        <div
          className="flex items-center bg-black space-x-3 opacity-90 
        hover:opacity-70 cursor-pointer rounded-full p-1 pr-2 text-white"
        >
          <ChevronLeftIcon
            className="h-10 w-10"
            onClick={() => {
              router.back();
            }}
          />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black
       ${color} h-80 text-white p-8`}
      >
        <div>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {category?.name}
          </h1>
        </div>
      </section>
      <div className="px-8 py-10">
        <section className="">
          <div className="grid grid-cols-9 gap-7 grid-flow-row-dense">
            {playlists?.items?.map((playlist) => (
              <div className="text-xs md:text-sm xl:text-md bg-gray-900 px-3 py-3 hover:bg-gray-700 cursor-pointer rounded-md">
                <div
                  className="relative items-center rounded-lg"
                  onClick={() => {
                    router.push({
                      pathname: "/playlist/[id]",
                      query: { id: playlist.id },
                    });
                  }}
                >
                  <img
                    className="relative items-center w-48 h-48 shadow-2xl rounded-lg"
                    src={playlist?.images?.[0].url}
                    alt=""
                  />
                  <p className="font-bold">{playlist?.name}</p>
                  <p className="truncate">{playlist?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default CenterCategory;
