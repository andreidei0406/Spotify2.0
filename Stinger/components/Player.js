import { durationState } from "@/atoms/durationAtoms";
import { oldQueueState, queueIdState } from "@/atoms/queueAtoms";
import { seekerState } from "@/atoms/seekerAtoms";
import {
  currentTrackIdState,
  isPlayingState,
  isRepeatState,
  isShuffleState,
  volumeState,
} from "@/atoms/songAtom";
import useSongInfo from "@/hooks/useSongInfo";
import useSpotify from "@/hooks/useSpotify";
import { millisToMinutesAndSeconds } from "@/lib/time";
import { VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce, shuffle } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

function Player() {
  const router = useRouter();
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useRecoilState(volumeState);
  const [queue, setQueue] = useRecoilState(queueIdState);
  const [oldQueue, setOldQueue] = useRecoilState(oldQueueState);
  const [seeker, setSeeker] = useRecoilState(seekerState);
  const [duration, setDuration] = useRecoilState(durationState);
  const songInfo = useSongInfo();
  const [shuffleMe, setShuffleMe] = useState(isShuffleState);
  const [repeat, setRepeat] = useRecoilState(isRepeatState);

  const fetchCurrentSong = () => {
    if (!songInfo && spotifyApi.getAccessToken()) {
      spotifyApi
        .getMyCurrentPlayingTrack()
        .then((data) => {
          setCurrentTrackId(data.body?.item.id);
          setDuration(millisToMinutesAndSeconds(data.body?.item.duration_ms));
          spotifyApi.getMyCurrentPlaybackState().then((data) => {
            console.log(data);
            setIsPlaying(data.body?.is_playing);
          });
        })
        .catch((err) =>
          console.error("Can't return current playing track:", err)
        );
    }
  };

  const handlePlayPause = () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        if (data.body?.is_playing) {
          // console.log(data.body);
          spotifyApi.pause();
          setIsPlaying(false);
          setSeeker(data?.body?.duration_ms);
        } else {
          spotifyApi.play();
          setIsPlaying(true);
          setSeeker(data?.body?.duration_ms);
        }
      });
    }
  };

  const playSong = (id) => {
    setCurrentTrackId(id);
    spotifyApi.play({
      uris: ["spotify:track:" + id],
    });
    setIsPlaying(true);
  };

  const skipNext = () => {
    console.log(queue);
    let index = 0;
    queue.forEach((element, i) => {
      if (
        element?.track?.id === currentTrackId ||
        element?.id === currentTrackId
      ) {
        index = i;
      }
    });
    if (index + 1 >= queue.length) {
      setCurrentTrackId(queue[0]?.track?.id ?? queue[0].id);
      setDuration(queue[0]?.track?.duration_ms ?? queue[0].duration_ms);
      playSong(queue[0]?.track?.id ?? queue[0].id);
      setIsPlaying(true);
    } else {
      setCurrentTrackId(queue[index + 1]?.track?.id ?? queue[index + 1].id);
      setDuration(
        queue[index + 1]?.track?.duration_ms ?? queue[index + 1].duration_ms
      );
      playSong(queue[index + 1]?.track?.id ?? queue[index + 1].id);
    }
  };

  const skipPrevious = () => {
    let index = 0;
    queue.forEach((element, i) => {
      if (
        element?.track?.id === currentTrackId ||
        element?.id === currentTrackId
      ) {
        index = i;
      }
    });
    if (index - 1 < 0) {
      setCurrentTrackId(queue[0]?.track?.id ?? queue[0].id);
      setDuration(queue[0]?.track?.duration_ms ?? queue[0].duration_ms);
      playSong(queue[0]?.track?.id ?? queue[0].id);
      setIsPlaying(true);
    } else {
      setCurrentTrackId(queue[index - 1]?.track?.id ?? queue[index - 1].id);
      setDuration(
        queue[index - 1]?.track?.duration_ms ?? queue[index - 1].duration_ms
      );
      playSong(queue[index - 1]?.track?.id ?? queue[index - 1].id);
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
      fetchCurrentSong();
      setVolume(50);
    }
  }, [session, spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && volume > 0 && volume < 100) {
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
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getMyCurrentPlaybackState()
        .then((data) => {
          setSeeker(data.body?.progress_ms);
        })
        .catch((err) => console.error("Can't seek: ", err));
    }
  }, [seeker, isPlaying, session, currentTrackId, spotifyApi]);

  const toggleShuffle = () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .setShuffle(!shuffleMe)
        .then(() => {
          if (shuffleMe) {
            setQueue(shuffle(queue));
          } else {
            setQueue(oldQueue);
          }
          setShuffleMe(!shuffleMe);
        })
        .catch((err) => console.error("Couldn't set shuffle", err));
    }
  };

  const toggleReplay = () => {
    if (!repeat) {
      spotifyApi
        .setRepeat("track")
        .then(() => {
          setRepeat(!repeat);
        })
        .catch((err) => console.error("Couldn't set repeat", err));
    } else {
      spotifyApi
        .setRepeat("off")
        .then(() => {
          setRepeat(!repeat);
        })
        .catch((err) => console.error("Couldn't set repeat", err));
    }
  };

  console.log("SHUFFLE QUUEUEUE", seeker);
  return (
    <div
      className="h-24 select-none hidden bg-gradient-to-b from-slate-800 to-black text-white
    xs:grid xs:grid-cols-3 text-cs md:text-base px-2 md:px-8"
    >
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10 hover:cursor-pointer hover:opacity-80"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
          onClick={() => {
            router.replace({
              pathname: "/screensaver",
            });
          }}
        />
        <div>
          <h3 className="">{songInfo?.name}</h3>
          <p
            className="hover:underline hover:cursor-pointer"
            onClick={() => {
              router.push({
                pathname: "/artist/[id]",
                query: { id: songInfo?.artists?.[0]?.id },
              });
            }}
          >
            {songInfo?.artists?.[0].name}
          </p>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-evenly">
          {shuffleMe ? (
            <SwitchHorizontalIcon className="button" onClick={toggleShuffle} />
          ) : (
            <SwitchHorizontalIcon
              className="button text-green-500"
              onClick={toggleShuffle}
            />
          )}
          <RewindIcon className="button" onClick={skipPrevious} />
          {isPlaying ? (
            <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
          ) : (
            <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
          )}
          <FastForwardIcon className="button" onClick={skipNext} />
          {repeat ? (
            <ReplyIcon
              className="button text-green-500"
              onClick={toggleReplay}
            />
          ) : (
            <ReplyIcon className="button" onClick={toggleReplay} />
          )}
        </div>
        <div className="flex flex-col py-3">
          <input
            className=" w-full h-1 bg-green-400 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700 hover:bg-white"
            // className="::-webkit-slider-thumb ::-webkit-slider-runnable-track w-full h-1 bg-green-400 rounded-lg cursor-pointer range-sm dark:bg-gray-700 hover:bg-white"
            type="range"
            value={seeker}
            onChange={(e) => {
              seekTo(Number(e.target.value));
            }}
            min={0}
            max={duration}
          />
        </div>
      </div>
      <div className="hidden sm:flex items-center space-x-2 sm:space-x-3 md:space-x-4 justify-end pr-5">
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
