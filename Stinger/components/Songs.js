import { playlistIdState, playlistState } from "@/atoms/playlistAtoms";
import { useRecoilState, useRecoilValue } from "recoil";
import Song from "./Song";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import { PlayIcon } from "@heroicons/react/solid";
import useSpotify from "@/hooks/useSpotify";
import { albumState } from "@/atoms/albumAtoms";
import { random, shuffle } from "lodash";
import { likeState, likedState } from "@/atoms/likedAtoms";
import { queueIdState } from "@/atoms/queueAtoms";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PuzzleIcon } from "@heroicons/react/solid";
import { gameArtistState, gameSongState } from "@/atoms/gameAtom";

function Songs({
  isAlbum,
  songs,
  albumImage,
  ignoreAlbumName,
  useHeigthScreen,
  ignoreHeader,
}) {
  const { data: session, status } = useSession();

  const spotifyApi = useSpotify();
  const playlist = useRecoilValue(playlistState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [queue, setQueue] = useRecoilState(queueIdState);
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [isLikedByUser, setIsLikedByUser] = useState([]);
  const [songGame, setSongGame] = useRecoilState(gameSongState);
  const [artistGame, setArtistGame] = useRecoilState(gameArtistState);
  console.log(songs);
  const shufflePlay = () => {
    let randomSong = null;
    console.log(songs);
    randomSong = random(songs.length - 1, false);

    setCurrentTrackId(
      songs?.[randomSong]?.track?.id ?? songs?.[randomSong]?.id
    );
    setIsPlaying(true);
    if (songs) {
      spotifyApi.play({
        uris: [songs?.[randomSong]?.track?.uri],
      });
    } else {
      spotifyApi.play({
        uris: [songs[randomSong].uri],
      });
    }
    const shuffled = [];
    songs.map((item) => {
      shuffled.push(item?.track ?? item);
    });
    setQueue(shuffle(shuffled));
  };

  const playGame = () => {
    if (router.pathname.includes("album")) {
      const artists = [];
      songs.map((item) => {
        artists.push(item?.artists?.[0]);
      });
      setSongGame(songs);
      setArtistGame(artists);
    } else {
      const gameSongs = [];
      const artists = [];
      songs.map((item) => {
        gameSongs.push(item?.track);
        artists.push(item?.track?.artists?.[0]);
      });
      setSongGame(gameSongs);
      setArtistGame(artists);
    }

    router.push({
      pathname: "/game",
      query: { album: isAlbum },
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && songs && songs.length !== 0) {
      const ids = [];
      songs?.map((item, i) => {
        if (i < 50) {
          ids.push(item.track?.id ?? item.id);
        }
      });
      console.log(ids);
      if (ids !== []) {
        console.log(ids);
        spotifyApi
          .containsMySavedTracks(ids)
          .then((data) => {
            setIsLikedByUser(data.body);
            console.log(data.body);
          })
          .catch((err) => console.error("Can't check", err));
      }
    }
  }, [songs]);

  console.log(songs);
  return (
    <div
      className={`bg-slate-800 ${
        useHeigthScreen ?? ""
      } px-8 flex flex-col space-y-1 pb-28 text-white select-none`}
    >
      {ignoreHeader ? (
        <div></div>
      ) : (
        <div className="">
          <div className="hidden xs:flex items-center float-left">
            <PlayIcon
              className="button w-14 h-14 text-green-500"
              onClick={shufflePlay}
            />
            <h2 className="text-green-500">Shuffle Play</h2>
          </div>

          <div className="hidden xs:flex items-center">
            <h2 className="text-green-500 ml-auto mr-2">Play a game!</h2>
            <PuzzleIcon
              className="button w-14 h-14 text-green-500 "
              onClick={playGame}
            />
          </div>
        </div>
      )}
      {songs?.map((track, i) => (
        <Song
          key={track.track?.id ?? track?.id}
          track={track.track ?? track}
          order={i}
          songs={songs}
          isLikedByUser={isLikedByUser[i] ?? false}
          albumImage={
            albumImage ??
            track?.track?.album?.images?.[0]?.url ??
            track?.album?.images?.[0]?.url ??
            track?.album?.images?.[1]?.url
          }
          ignoreAlbumName={ignoreAlbumName}
        />
      ))}
    </div>
  );
}

export default Songs;
