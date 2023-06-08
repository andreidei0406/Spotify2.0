import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify";
import { millisToMinutesAndSeconds } from "@/lib/time";
import { useRecoilState } from "recoil";

function Song({ order, track, albumTrack }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track?.track.id ?? albumTrack.id);
    setIsPlaying(true);
    if(albumTrack){
      spotifyApi.play({
        uris: [albumTrack?.uri]
      });
    } else{
      spotifyApi.play({
        uris: [track?.track.uri]
      });
    }
  };

  console.log(albumTrack);

  return (
    <div
      className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900
    rounded-lg cursor-pointer"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          className="h-10 w-10"
          src={track?.track.album.images?.[0]?.url ?? 'https://w7.pngwing.com/pngs/803/536/png-transparent-musical-note-icon-music-angle-white-text-thumbnail.png'}
          alt=""
        />
        <div>
          <p className="w-36 lg:w-64 truncate text-white">{track?.track.name ?? albumTrack.name}</p>
          <p className="w-40">{track?.track.artists[0].name ?? albumTrack.artists[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline">{track?.track.album.name ?? albumTrack.name}</p>
        <p>{millisToMinutesAndSeconds(track?.track.duration_ms ?? albumTrack.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
