import useSpotify from "@/hooks/useSpotify";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { shuffle } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const liked = () => {
    spotifyApi.getMySavedTracks({ offset: 0, limit: 50 }).then((data) => {
      console.log(data);
    });
  };
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [session]);

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
      <div className="mt-5 ml-8">
        <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
          Hello {session?.user.name}
        </h1>
      </div>
      <div
        className="grid grid-cols-2 text-gray-500 py-4 px-8
    rounded-lg"
      >
        <div className=" hover:bg-gray-200">
          <img src="" />
          <p>Liked Songs</p>
        </div>
        <div>AICI E 2</div>
      </div>
    </div>
  );
}

export default HomeCenter;
