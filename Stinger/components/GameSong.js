import { gameSongState } from "@/atoms/gameAtom";
import { currentTrackIdState } from "@/atoms/songAtom";
import { winnerState } from "@/atoms/winnerAtom";
import useSpotify from "@/hooks/useSpotify";
import { LightningBoltIcon, LogoutIcon, XIcon } from "@heroicons/react/solid";
import { random, shuffle } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
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

function GameSong() {
  const spotifyApi = useSpotify();

  const router = useRouter();
  const { data: session } = useSession();
  const [color, setColor] = useState("");
  const songGame = useRecoilValue(gameSongState);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [displayedSongs, setDisplayedSongs] = useState([]);
  const [correctSong, setCorrectSong] = useState(0);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
    console.log(songGame);
  }, [router.query.id]);

  useEffect(() => {
    if (gameEnded) {
      spotifyApi.pause();
    }

    if (!gameEnded) {
      const songs = [];
      for (let i = 0; i < 4; i++) {
        let randomIndex = random(songGame.length - 1, false);
        while (songs.includes(songGame[randomIndex])) {
          randomIndex = random(songGame.length - 1, false);
        }
        songs.push(songGame[randomIndex]);
      }
      setDisplayedSongs(songs);
      console.log(songs);

      if (gameStarted) {
        const randomIndex = random(songs.length - 1, false);
        setCorrectSong(songs[randomIndex].id);
        setCurrentTrackId(songs[randomIndex].id);
        spotifyApi.play({
          uris: [songs[randomIndex].uri],
          position_ms: 20000,
        });
      }
    }
  }, [gameStarted, gameEnded]);

  const countdownFinished = () => {
    setGameEnded(true);
  };

  const checkWinner = (id) => {
    console.log(correctSong === id);
    if (id === correctSong) {
      return true;
    }
    return false;
  };

  return (
    <div className="bg-slate-800 flex-grow h-screen overflow-y-scroll select-none scrollbar-hide">
      <header className="relative top-5 left-8">
        <div
          className="absolute hidden xs:flex items-center bg-black space-x-3 opacity-90 
        hover:opacity-70 cursor-pointer rounded-full p-1 pr-2 text-white"
        >
          <XIcon
            className="h-10 w-10"
            onClick={() => {
              spotifyApi.pause();
              router.back();
            }}
          />
        </div>
      </header>
      <section
        className={`flex items-center justify-center space-x-7 bg-gradient-to-b to-slate-800
         ${color} h-screen text-white p-8`}
      >
        {gameStarted ? (
          <div className="grid grid-cols-1">
            <h1 className="text-2xl xl:text-3xl 2xl:text-5xl font-bold">
              {gameEnded ? (
                <div className="text-center">
                  <h1>Please choose one option!</h1>
                  <div className="text-center text-black py-5">
                    {displayedSongs.map((song, i) => (
                      <div className="py-5">
                        <p
                          className="hover:cursor-pointer hover:underline"
                          key={song?.id}
                          onClick={() => {
                            console.log(song.id);
                            router.replace({
                              pathname: "/game",
                              query: {
                                album: router.query.album,
                                winner: checkWinner(song?.id),
                              },
                            });
                          }}
                        >
                          {song?.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Countdown
                  onComplete={countdownFinished}
                  date={Date.now() + 10000}
                ></Countdown>
              )}
            </h1>
          </div>
        ) : (
          <div className="grid grid-cols-1">
            <h1 className="text-2xl xl:text-3xl 2xl:text-5xl font-bold">
              Feel free to press <i>START</i> whenever you are ready! The song
              is going to play for 10 seconds
            </h1>
            <div className="flex justify-center py-5">
              <button
                className="button w-20 h-20"
                onClick={() => {
                  setGameStarted(true);
                }}
              >
                <LightningBoltIcon />
                <p className="text-lg">Start</p>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default GameSong;
