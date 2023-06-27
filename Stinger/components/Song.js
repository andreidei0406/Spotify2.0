import { albumIdState, albumState } from "@/atoms/albumAtoms";
import { durationState } from "@/atoms/durationAtoms";
import { likedState } from "@/atoms/likedAtoms";
import { playlistState } from "@/atoms/playlistAtoms";
import { queueIdState } from "@/atoms/queueAtoms";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify";
import { millisToMinutesAndSeconds } from "@/lib/time";
import { HeartIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { HeartIcon as BlankHeartIcon } from "@heroicons/react/outline";

function Song({
  order,
  track,
  albumTrack,
  isLiked,
  isPlaylist,
  isLikedByUser,
  songs,
  albumImage
}) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [queue, setQueue] = useRecoilState(queueIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [duration, setDuration] = useRecoilState(durationState);

  const playSong = () => {
    setCurrentTrackId(track?.id);
    setIsPlaying(true);
      spotifyApi.play({
        uris: [track?.uri],
      });
      setDuration(track?.duration_ms);
      setQueue(songs);
  };

  const removeFromLiked = () => {
    if (albumTrack) {
      console.log(albumTrack.id);
      spotifyApi
        .removeFromMySavedTracks([albumTrack.id])
        .then()
        .catch((err) => console.error("Couldn't remove track", err));
    } else {
      spotifyApi
        .removeFromMySavedTracks([track.track?.id])
        .then()
        .catch((err) => console.error("Couldn't remove track", err));
    }
  };

  const addToLiked = () => {
    if (albumTrack) {
      console.log(albumTrack.id);
      spotifyApi
        .addToMySavedTracks([albumTrack.id])
        .then()
        .catch((err) => console.error("Couldn't save track", err));
    } else {
      spotifyApi
        .addToMySavedTracks([track.track?.id])
        .then()
        .catch((err) => console.error("Couldn't save track", err));
    }
  };

  return (
    <div
      className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900
    rounded-lg cursor-pointer"
      onDoubleClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          className="h-10 w-10 xxs:w-8 xxs:h-8"
          src={albumImage}
          alt=""
        />
        <div className="hidden xs:block">
          <p className="w-36 md:w-64 lg:w-80 truncate text-white">
            {track?.name}
          </p>
          <p className="w-40">{track?.artists[0].name}</p>
        </div>
      </div>

      <div className="hidden xs:flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden sm:inline">{track?.album?.name ?? track?.name}</p>
        <p>{millisToMinutesAndSeconds(track?.duration_ms)}</p>
        {isLikedByUser ? (
          <HeartIcon className="button" onClick={removeFromLiked} />
        ) : (
          <BlankHeartIcon className="button" onClick={addToLiked} />
        )}
      </div>
    </div>
  );
}

export default Song;
