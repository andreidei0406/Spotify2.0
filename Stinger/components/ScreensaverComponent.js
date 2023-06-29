import useSongInfo from "@/hooks/useSongInfo";
import { MusicNoteIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon, LogoutIcon } from "@heroicons/react/solid";
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

function ScreensaverComponent() {
  const router = useRouter();
  const songInfo = useSongInfo();
  const { data: session } = useSession();
  const [color, setColor] = useState("");

  const [track, setTrack] = useState(null);
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [session]);

  console.log(songInfo);

  return (
    <div className="bg-slate-800 items-center justify-center flex-grow h-screen overflow-y-scroll scrollbar-hide select-none">
      <header className="relative top-5 left-8">
        <div
          className="absolute hidden xs:flex items-center bg-black space-x-3 opacity-90 
        hover:opacity-70 cursor-pointer rounded-full p-1 pr-2 text-white"
        >
          <ChevronLeftIcon
            className="h-10 w-10"
            onClick={() => {
              router.replace({
                pathname: "/",
              });
            }}
          />
        </div>
      </header>
      <section
        className={`grid grid-cols-1 place-items-center space-x-7 bg-gradient-to-b to-slate-800
             ${color} h-screen text-white p-8`}
      >
        <div className="grid grid-cols-1 place-items-center">
          <div className="xs:px-3 xs:py-3 rounded-3xl">
            <img
              className="relative xxs:w-22 xxs:h-22 xs:w-32 xs:h-32 md:w-24 md:h-24 lg:w-40 lg:h-40 xl:w-50 xl:h-50 2xl:w-96 2xl:h-96 shadow-2xl rounded-lg"
              src={songInfo?.album?.images?.[0]?.url}
              alt=""
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl">{songInfo?.name}</h1>
            {songInfo?.artists?.map((artist, i) =>(
                <span className="text-2xl">{artist.name} </span>
            ))}
            <h1 className="text-2xl">Popularity {songInfo?.popularity}%</h1>
          </div>
        </div>
      </section>
    </div>
  );
}
export default ScreensaverComponent;
