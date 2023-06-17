import { playlistState } from "@/atoms/playlistAtoms";
import { useRecoilState, useRecoilValue } from "recoil";
import Song from "./Song";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import { PlayIcon } from "@heroicons/react/solid";
import useSpotify from "@/hooks/useSpotify";
import { albumState } from "@/atoms/albumAtoms";
import { random, shuffle } from "lodash";
import { likeState, likedState } from "@/atoms/likedAtoms";
import { queueIdState } from "@/atoms/queueAtoms";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

function Songs({ isAlbum, isLiked }) {
  const { data: session, status } = useSession();

  const spotifyApi = useSpotify();
  const playlist = useRecoilValue(playlistState);
  const album = useRecoilValue(albumState);
  const liked = useRecoilValue(likedState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [queue, setQueue] = useRecoilState(queueIdState);

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
      const songs = [];
      album.tracks.items.map((item) => {
        songs.push(item);
      });
      setQueue(shuffle(songs));
    } else if (isLiked) {
      spotifyApi.play({
        uris: [liked?.items[randomSong].track.uri],
      });
      const songs = [];
      liked.items.map((item) => {
        songs.push(item.track);
      });
      setQueue(shuffle(songs));
    } else {
      spotifyApi.play({
        uris: [playlist?.tracks.items[randomSong].track.uri],
      });
      const songs = [];
      playlist.tracks.items.map((item) => {
        songs.push(item.track);
      });
      setQueue(shuffle(songs));
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
        ? liked?.map((track, i) => (
            <Song key={track.track.id} isLiked='true' track={track} order={i} />
          ))
        : playlist?.tracks.items.map((track, i) => (
            <Song key={track.track.id} isPlaylist='true' track={track} order={i} />
          ))}
    </div>
  );
}

export default Songs;
