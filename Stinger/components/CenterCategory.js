import useSpotify from "@/hooks/useSpotify";
import { ChevronDownIcon, ChevronLeftIcon } from "@heroicons/react/solid";
import { LogoutIcon } from "@heroicons/react/solid";
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

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [router.query.id]);

  useEffect(() => {
    spotifyApi
      .getCategory(router.query.id)
      .then((data) => {
        setCategory(data?.body);
      })
      .catch((err) => console.log("Something went wrong!", err));
  }, [spotifyApi, session, router.query.id]);

  useEffect(() => {
    if (category) {
      spotifyApi
        .getPlaylistsForCategory(category?.id)
        .then((data) => {
          setPlaylists(data.body?.playlists);
        })
        .catch((err) => console.log("Something went wrong!", err));
    }
  }, [spotifyApi, session, category]);

  console.log(playlists);

  return (
    <div className="flex-grow bg-slate-800 h-screen overflow-y-scroll scrollbar-hide pb-36 select-none">
      <header className="relative">
        <div
          className="absolute hidden xs:flex top-5 right-8 items-center bg-black space-x-3 opacity-90 
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
      <header className="relative top-5 left-8">
        <div
          className="absolute hidden xs:flex items-center bg-black space-x-3 opacity-90 
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
        className={`flex items-end space-x-7 bg-gradient-to-b to-slate-800
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xxs:gap-3 xs:gap-4 sm:gap-5 md:gap-7 py-4 px-8 grid-flow-row-dense">
            {playlists?.items?.map((playlist) => (
              <div
                key={playlist.id}
                className="text-xs md:text-sm xl:text-md bg-gray-900 xs:px-3 xs:py-3 hover:bg-gray-700 cursor-pointer rounded-md"
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
                <p className="hidden xs:flex font-bold">{playlist?.name}</p>
                <p className="hidden xs:flex truncate">
                  {playlist?.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default CenterCategory;
