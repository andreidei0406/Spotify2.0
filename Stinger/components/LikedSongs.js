import { likeState, likedState } from "@/atoms/likedAtoms";
import useSpotify from "@/hooks/useSpotify";
import { ChevronDownIcon, ChevronLeftIcon } from "@heroicons/react/solid";
import { cloneDeep, random, shuffle } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Songs from "./Songs";
import { queueIdState } from "@/atoms/queueAtoms";
import { LogoutIcon } from "@heroicons/react/solid";
import useLikedSongs from "@/hooks/useLikedSongs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-purple-500",
  "from-sky-500",
];

function LikedSongs() {
  const [queue, setQueue] = useRecoilState(queueIdState);

  const router = useRouter();
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const [liked, setLiked] = useRecoilState(likedState);
  const [
    total,
    setTotal = (param) => {
      total.push(param);
    },
  ] = useState(null);

  // all songs, but it will take time to load + maybe the pc is gonna explode
  // const likedSongs = useLikedSongs();

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [router.query.id]);

  useEffect(() => {
    spotifyApi.getMySavedTracks().then((data) => {
      setTotal(data.body?.total);
    });
  });

  useEffect(() => {
    spotifyApi
      .getMySavedTracks({ limit: 50 })
      .then((data) => {
        setLiked(data.body?.items);
      })
      .catch((err) => console.log("Something went wrong!", err));
  }, [spotifyApi]);


  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide select-none">
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
        <img
          className="xxs:w-36 xxs:h-36 xs:w-44 xs:h-44 shadow-2xl"
          src="https://preview.redd.it/rnqa7yhv4il71.jpg?width=1200&format=pjpg&auto=webp&v=enabled&s=149162703adc5ffe8cfce481b78081f7f534f739"
          alt=""
        />
        <div className="hidden xs:block">
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            Liked Songs
          </h1>
          <div className="inline-flex items-center space-x-3">
            <img
              className="rounded-full w-5 h-5"
              src={session?.user.image}
              alt=""
            />
            <p>{session?.user.name}</p>
            <p>{total} songs</p>
          </div>
        </div>
      </section>

      <div><Songs songs={liked}/></div>
    </div>
  );
}

export default LikedSongs;
