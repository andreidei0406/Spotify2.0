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
import { seekerState } from "@/atoms/seekerAtoms";
import { durationState } from "@/atoms/durationAtoms";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const [queue, setQueue] = useRecoilState(queueIdState);
  const [seeker, setSeeker] = useRecoilState(seekerState);
  const [duration, setDuration] = useRecoilState(durationState);
  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now playing: ", data.body?.item);
        setCurrentTrackId(data.body?.item.id);
        setDuration(data.body.item.duration_ms);
        console.log(duration);
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    setSeeker(0);
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        console.log(data.body);
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
    spotifyApi.play({
      uris: ["spotify:track:" + id],
    });
    setIsPlaying(true);
  };

  const skipNext = () => {
    let index = 0;
    queue.forEach((element, i) => {
      if (element.id === currentTrackId) {
        index = i;
      }
    });
    if (index + 1 > queue.length) {
      setCurrentTrackId(queue[0].id);
      setDuration(queue[0].duration_ms);
      spotifyApi.pause();
      setIsPlaying(false);
    } else {
      setCurrentTrackId(queue[index + 1].id);
      setDuration(queue[index + 1].duration_ms);
      playSong(queue[index + 1].id);
    }
  };

  const skipPrevious = () => {
    const index = queue.indexOf(currentTrackId);
    if (index - 1 < 0) {
      setCurrentTrackId(queue[0]);
      setDuration(queue[0].duration_ms);
    } else {
      setCurrentTrackId(queue[index - 1].id);
      setDuration(queue[index - 1].duration_ms);
      playSong(queue[index - 1].id);
    }
  };

  const seekTo = (position) => {
    spotifyApi
      .seek(position)
      .then(setSeeker(position))
      .catch((err) => console.log("Couldn't seek", err));
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      //fetch song info
      fetchCurrentSong();
      setVolume(50);
    }
  });

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

  useEffect(() => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      setSeeker(data.body.progress_ms);
    });
  }, [seeker, isPlaying, session, currentTrackId, spotifyApi]);

  console.log(seeker);
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
            // className=" w-full h-1 bg-green-400 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700 hover:bg-white"
            className="::-webkit-slider-thumb ::-webkit-slider-runnable-track w-full h-1 bg-green-400 rounded-lg cursor-pointer range-sm dark:bg-gray-700 hover:bg-white"
            type="range"
            value={seeker}
            onChange={(e) => {
              seekTo(Number(e.target.value));
            }}
            min={0}
            max={duration} // track.duration
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
          onChange={(e) => seekTo(Number(e.target.value))}
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
