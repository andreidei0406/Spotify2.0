import { ChevronDownIcon, ChevronLeftIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "@/atoms/playlistAtoms";
import useSpotify from "@/hooks/useSpotify";
import Songs from "./Songs";
import { useRouter } from "next/router";
import { albumState } from "@/atoms/albumAtoms";
import { LogoutIcon } from "@heroicons/react/solid";
import { artistState } from "@/atoms/artistAtom";

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

function CenterArtist() {
  const router = useRouter();
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const [artist, setArtist] = useRecoilState(artistState);
  const [artistTopSongs, setArtistTopSongs] = useState([]);
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [router.query.id]);

  useEffect(() => {
    spotifyApi
      .getArtist(router.query.id)
      .then((data) => {
        console.log(data);
        setArtist(data.body);
      })
      .catch((err) => console.log("Something went wrong!", err));
  }, [spotifyApi, router.query.id]);

  useEffect(() => {
    spotifyApi
      .getArtistTopTracks(artist?.id, "RO")
      .then((data) => {
        console.log(data);
        setArtistTopSongs(data.body.tracks);
      })
      .catch((err) => {
        console.error("Couldn't get artist top tracks", err);
      });
  }, [artist, session, spotifyApi]);

  console.log(artist);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
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
        <div className="absolute hidden xs:flex items-center bg-black space-x-3 opacity-90 
        hover:opacity-70 cursor-pointer rounded-full p-1 pr-2 text-white">
          <ChevronLeftIcon className="h-10 w-10" onClick={()=>{
            router.back();
          }} />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-slate-800
       ${color} h-80 text-white p-8`}
      >
        <img
          className="w-44 h-44 shadow-2xl"
          src={artist?.images?.[0].url}
          alt=""
        />
        <div>
          <p>ARTIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {artist?.name}
          </h1>
          <span>{artist?.followers?.total} Followers</span>
        </div>
      </section>

      <div>
        <Songs songs={artistTopSongs} isAlbum={true} />
      </div>
    </div>
  );
}

export default CenterArtist;
