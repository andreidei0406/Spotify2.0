import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSongInfo from "@/hooks/useSongInfo";
import useSpotify from "@/hooks/useSpotify";
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { debounce } from "lodash";
import { queueIdState } from "@/atoms/queueAtoms";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const [queue, setQueue] = useRecoilState(queueIdState);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now playing: ", data.body?.item);
        setCurrentTrackId(data.body?.item.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  const playSong = (id) => {
    setCurrentTrackId(id);
    setIsPlaying(true);
      spotifyApi.play({
        uris: ["spotify:track:"+id]
      });
  };

  const skipNext = () => {
    spotifyApi.skipToNext().then(
      function () {
        const index = queue.indexOf(currentTrackId);
        if(index + 1 > queue.length){
          setCurrentTrackId(queue[0]);
          setIsPlaying(false);
        } else{
          playSong(queue[index+1]);
        }
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  };

  const skipPrevious = () => {
    spotifyApi.skipToPrevious().then(
      function () {
        const index = queue.indexOf(currentTrackId);
        if(index - 1 < 0){
          setCurrentTrackId(queue[0]);
        } else{
          playSong(queue[index-1]);
        }

      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      //fetch song info
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 500),
    []
  );

    console.log(queue);

  return (
    <div
      className="h-24 bg-gradient-to-b from-black to-gray-900 text-white
    grid grid-cols-3 text-cs md:text-base px-2 md:px-8"
    >
      {/* left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0].name}</p>
        </div>
      </div>
      {/* center */}
      <div className="mt-5">
        <div className="flex items-center justify-evenly">
          <SwitchHorizontalIcon className="button" />
          <RewindIcon className="button" onClick={skipPrevious} />
          {isPlaying ? (
            <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
          ) : (
            <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
          )}
          <FastForwardIcon className="button" onClick={skipNext} />
          <ReplyIcon className="button" />
        </div>
        <div className="flex flex-col py-3">
          <input
            className="w-full h-1 bg-green-400 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700 hover:bg-white"
            type="range"
            // value={0}
            // value={track}
            // onChange={}
            min={0}
            max={100} // track.duration
          />
        </div>
      </div>
      {/* right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
