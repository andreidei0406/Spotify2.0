import { ChevronDownIcon, ChevronLeftIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "@/atoms/playlistAtoms";
import useSpotify from "@/hooks/useSpotify";
import Songs from "./Songs";
import { useRouter } from "next/router";

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

function CenterPlaylist() {
  const router = useRouter();
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [router.query.id]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(router.query.id)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("Something went wrong!", err));
  }, [spotifyApi, router.query.id]);

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
      <header className="absolute top-5 left-8 ml-60">
        <div className="flex items-center bg-black space-x-3 opacity-90 
        hover:opacity-70 cursor-pointer rounded-full p-1 pr-2 text-white">
          <ChevronLeftIcon className="h-10 w-10" onClick={()=>{
            router.back();
          }} />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black
       ${color} h-80 text-white p-8`}
      >
        <img
          className="w-44 h-44 shadow-2xl"
          src={playlist?.images?.[0].url}
          alt=""
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs isAlbum={false}/>
      </div>
    </div>
  );
}

export default CenterPlaylist;
