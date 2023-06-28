import { gameArtistState, gameSongState } from "@/atoms/gameAtom";
import { winnerState } from "@/atoms/winnerAtom";
import { MusicNoteIcon } from "@heroicons/react/outline";
import {
  ChevronLeftIcon,
  LogoutIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/solid";
import { shuffle } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

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

function GameComponent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [color, setColor] = useState("");
  const songGame = useRecoilValue(gameSongState);
  const artistGame = useRecoilValue(gameArtistState);

  const [firstTime, setFirstTime] = useState(true);
  const [winner, setWinner] = useRecoilState(winnerState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
    if (winner !== null) {
      setFirstTime(false);
    }
    console.log(songGame);
    console.log(artistGame);
  }, [router.query.id]);

  console.log(router);

  return (
    <div className="bg-slate-800 flex-grow h-screen overflow-y-scroll scrollbar-hide">
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
              router.replace({
                pathname: "/",
              });
            }}
          />
        </div>
      </header>

      {router.query.winner === undefined ? (
        <section
          className={`grid place-items-center space-x-7 bg-gradient-to-b to-slate-800
             ${color} h-screen text-white p-8`}
        >
          {router.query.album === "true" ? (
            <div className="grid grid-cols-1 gap-60">
              <div
                className="text-xs md:text-sm xl:text-5xl bg-gray-900 xs:px-3 xs:py-3 hover:bg-gray-700 cursor-pointer rounded-3xl"
                onClick={() => {
                  router.push({
                    pathname: "game/song",
                  });
                }}
              >
                <h1>Guess the song!</h1>
                <MusicNoteIcon />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-60">
              <div
                className="text-xs md:text-sm xl:text-5xl bg-gray-900 xs:px-3 xs:py-3 hover:bg-gray-700 cursor-pointer rounded-3xl"
                onClick={() => {
                  router.push({
                    pathname: "game/artist",
                  });
                }}
              >
                <h1>Guess the artist!</h1>
                <UserIcon />
              </div>
              <div
                className="text-xs md:text-sm xl:text-5xl bg-gray-900 xs:px-3 xs:py-3 hover:bg-gray-700 cursor-pointer rounded-3xl"
                onClick={() => {
                  router.push({
                    pathname: "game/song",
                  });
                }}
              >
                <h1>Guess the song!</h1>
                <MusicNoteIcon />
              </div>
            </div>
          )}
        </section>
      ) : router.query.winner === "true" ? (
        <section
          className={`grid grid-cols-1 place-items-center space-x-7 bg-gradient-to-b to-slate-800
             ${color} h-screen text-white p-8`}
        >
          <h1 className="text-2xl xl:text-3xl 2xl:text-5xl font-bold text-white">
            Congrats you won! Feel free to play again!
          </h1>
          {router.query.album === "true" ? (
            <div className="grid grid-cols-1 gap-60">
              <div
                className="text-xs md:text-sm xl:text-5xl bg-gray-900 xs:px-3 xs:py-3 hover:bg-gray-700 cursor-pointer rounded-3xl"
                onClick={() => {
                  router.push({
                    pathname: "game/song",
                  });
                }}
              >
                <h1>Guess the song!</h1>
                <MusicNoteIcon />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-60">
              <div
                className="text-xs md:text-sm xl:text-5xl bg-gray-900 xs:px-3 xs:py-3 hover:bg-gray-700 cursor-pointer rounded-3xl"
                onClick={() => {
                  router.push({
                    pathname: "game/artist",
                  });
                }}
              >
                <h1>Guess the artist!</h1>
                <UserIcon />
              </div>
              <div
                className="text-xs md:text-sm xl:text-5xl bg-gray-900 xs:px-3 xs:py-3 hover:bg-gray-700 cursor-pointer rounded-3xl"
                onClick={() => {
                  router.push({
                    pathname: "game/song",
                  });
                }}
              >
                <h1>Guess the song!</h1>
                <MusicNoteIcon />
              </div>
            </div>
          )}
        </section>
      ) : (
        <section
          className={`grid grid-cols-1 place-items-center space-x-7 bg-gradient-to-b to-slate-800
             ${color} h-screen text-white p-8`}
        >
          <h1 className="text-2xl xl:text-3xl 2xl:text-5xl font-bold text-white">
            Incorrect! Better luck next time!
          </h1>
          {router.query.album === "true" ? (
            <div className="grid grid-cols-1 gap-60">
              <div
                className="text-xs md:text-sm xl:text-5xl bg-gray-900 xs:px-3 xs:py-3 hover:bg-gray-700 cursor-pointer rounded-3xl"
                onClick={() => {
                  router.push({
                    pathname: "game/song",
                  });
                }}
              >
                <h1>Guess the song!</h1>
                <MusicNoteIcon />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-60">
              <div
                className="text-xs md:text-sm xl:text-5xl bg-gray-900 xs:px-3 xs:py-3 hover:bg-gray-700 cursor-pointer rounded-3xl"
                onClick={() => {
                  router.push({
                    pathname: "game/artist",
                  });
                }}
              >
                <h1>Guess the artist!</h1>
                <UserIcon />
              </div>
              <div
                className="text-xs md:text-sm xl:text-5xl bg-gray-900 xs:px-3 xs:py-3 hover:bg-gray-700 cursor-pointer rounded-3xl"
                onClick={() => {
                  router.push({
                    pathname: "game/song",
                  });
                }}
              >
                <h1>Guess the song!</h1>
                <MusicNoteIcon />
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
export default GameComponent;
