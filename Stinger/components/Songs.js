import { playlistState } from "@/atoms/playlistAtoms";
import { useRecoilState, useRecoilValue } from "recoil";
import Song from "./Song";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import { PlayIcon } from "@heroicons/react/solid";
import useSpotify from "@/hooks/useSpotify";

function Songs() {
  const spotifyApi = useSpotify();
  const playlist = useRecoilValue(playlistState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const shufflePlay = () => {
    const randomSong = Math.floor(Math.random() * playlist?.tracks.items.length);
    setCurrentTrackId(playlist?.tracks.items[randomSong].track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [playlist?.tracks.items[randomSong].track.uri],
    });
  }

  return (
    <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
      <div className="flex items-center">
        <PlayIcon className="button w-14 h-14 text-green-500 mr-1" onClick={shufflePlay}/>
        <h2 className="text-green-500">Shuffle Play</h2>
      </div>
      {playlist?.tracks.items.map((track, i) => (
        <Song key={track.track.id} track={track} order={i} />
      ))}
    </div>
  );
}

export default Songs;