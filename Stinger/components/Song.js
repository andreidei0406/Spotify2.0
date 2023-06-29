import { albumIdState, albumState } from "@/atoms/albumAtoms";
import { durationState } from "@/atoms/durationAtoms";
import { likedState } from "@/atoms/likedAtoms";
import { playlistState } from "@/atoms/playlistAtoms";
import { oldQueueState, queueIdState } from "@/atoms/queueAtoms";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify";
import { millisToMinutesAndSeconds } from "@/lib/time";
import { HeartIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { HeartIcon as BlankHeartIcon } from "@heroicons/react/outline";
import { add } from "lodash";

function Song({
  order,
  track,
  albumTrack,
  isLiked,
  isPlaylist,
  isLikedByUser,
  songs,
  albumImage,
  ignoreAlbumName,
}) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [queue, setQueue] = useRecoilState(queueIdState);
  const [oldQueue, setOldQueue] = useRecoilState(oldQueueState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [duration, setDuration] = useRecoilState(durationState);
  const [isActive, setIsActive] = useState(false);
  const [isActive2, setIsActive2] = useState(false);

  const playSong = () => {
    console.log(track?.id);
    setCurrentTrackId(track?.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track?.uri],
    });
    setDuration(track?.duration_ms);
    setQueue(songs);
    setOldQueue(songs);
  };

  const removeFromLiked = () => {
    console.log(track);
    spotifyApi
      .removeFromMySavedTracks([track?.id])
      .then(() => console.log(isLikedByUser))
      .catch((err) => console.error("Couldn't remove track", err));
  };

  const addToLiked = () => {
    console.log(track);
    spotifyApi
      .addToMySavedTracks([track?.id])
      .then(() => console.log(isLikedByUser))
      .catch((err) => console.error("Couldn't save track", err));
  };

  return (
    <div
      className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900
    rounded-lg cursor-pointer select-none"
      onDoubleClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img className="h-10 w-10 xxs:w-8 xxs:h-8" src={albumImage} alt="" />
        <div className="hidden xs:block">
          <p className="w-36 md:w-64 lg:w-80 truncate text-white">
            {track?.name}
          </p>
          {track.artists.map((artist) => (
            <p key={artist.id} className="w-40">{artist.name}</p>
          ))}
        </div>
      </div>

      <div className="hidden xs:flex items-center justify-between ml-auto md:ml-0">
        {ignoreAlbumName ? (
          <div></div>
        ) : (
          <p className="w-40 hidden sm:inline">
            {track?.album?.name ?? track?.name}
          </p>
        )}

        <p>{millisToMinutesAndSeconds(track?.duration_ms)}</p>
        {isLikedByUser ? (
          <div>
            {isActive ? (
              <BlankHeartIcon
                className="button select-none"
                onClick={() => {
                  addToLiked();
                  setIsActive(!isActive);
                }}
              />
            ) : (
              <HeartIcon
                className="button select-none"
                onClick={() => {
                  removeFromLiked();
                  setIsActive(!isActive);
                }}
              />
            )}
          </div>
        ) : (
          <div>
            {isActive2 ? (
              <HeartIcon
                className="button select-none"
                onClick={() => {
                  removeFromLiked();
                  setIsActive2(!isActive2);
                }}
              />
            ) : (
              <BlankHeartIcon
                className="button select-none"
                onClick={() => {
                  addToLiked();
                  setIsActive2(!isActive2);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Song;
