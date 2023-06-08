import { playlistState } from "@/atoms/playlistAtoms";
import { useRecoilState, useRecoilValue } from "recoil";
import Song from "./Song";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import { PlayIcon } from "@heroicons/react/solid";
import useSpotify from "@/hooks/useSpotify";
import { albumState } from "@/atoms/albumAtoms";
import { random } from "lodash";
import { likeState, likedState } from "@/atoms/likedAtoms";

function Songs({ isAlbum, isLiked }) {
  const spotifyApi = useSpotify();
  const playlist = useRecoilValue(playlistState);
  const album = useRecoilValue(albumState);
  const liked = useRecoilValue(likedState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const shufflePlay = () => {
    const randomSong = isAlbum
      ? random(album?.tracks.items.length - 1, false)
      : isLiked
      ? random(liked?.items.length - 1, false)
      : random(playlist?.tracks.items.length - 1, false);
    setCurrentTrackId(
      isAlbum
        ? album?.tracks.items[randomSong].id
        : isLiked
        ? liked?.items[randomSong].track.id
        : playlist?.tracks.items[randomSong].track.id
    );
    setIsPlaying(true);
    if (isAlbum) {
      spotifyApi.play({
        uris: [album?.tracks.items[randomSong].uri],
      });
    } else if (isLiked) {
      spotifyApi.play({
        uris: [liked?.items[randomSong].track.uri],
      });
    } else {
      spotifyApi.play({
        uris: [playlist?.tracks.items[randomSong].track.uri],
      });
    }
  };

  return (
    <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
      <div className="flex items-center">
        <PlayIcon
          className="button w-14 h-14 text-green-500 mr-1"
          onClick={shufflePlay}
        />
        <h2 className="text-green-500">Shuffle Play</h2>
      </div>
      {isAlbum
        ? album?.tracks.items.map((track, i) => (
            <Song key={track.id} albumTrack={track} order={i} />
          ))
        : isLiked
        ? liked?.items.map((track, i) => (
            <Song key={track.track.id} track={track} order={i} />
          ))
        : playlist?.tracks.items.map((track, i) => (
            <Song key={track.track.id} track={track} order={i} />
          ))}
    </div>
  );
}

export default Songs;
