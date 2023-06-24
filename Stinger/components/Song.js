import { albumIdState, albumState } from "@/atoms/albumAtoms";
import { durationState } from "@/atoms/durationAtoms";
import { likedState } from "@/atoms/likedAtoms";
import { playlistState } from "@/atoms/playlistAtoms";
import { queueIdState } from "@/atoms/queueAtoms";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify";
import { millisToMinutesAndSeconds } from "@/lib/time";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

function Song({ order, track, albumTrack, isLiked, isPlaylist }) {
  const router = useRouter();
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [queue, setQueue] = useRecoilState(queueIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [duration, setDuration] = useRecoilState(durationState);
  const [image, setImage] = useState(null);
  const playlist = useRecoilValue(playlistState);
  const album = useRecoilValue(albumState);
  const liked = useRecoilValue(likedState);
  const playSong = () => {
    setCurrentTrackId(track?.track.id ?? albumTrack.id);
    setIsPlaying(true);
    if (albumTrack) {
      spotifyApi.play({
        uris: [albumTrack?.uri],
      });
      const songsUri =[];
      album.tracks.items.map((track) =>{
        songsUri.push(track);
      })
      setDuration(albumTrack?.duration_ms);
      setQueue(songsUri);
    } else if(isLiked) {
      spotifyApi.play({
        uris: [track?.track.uri],
      });
      const songsUri =[];
      liked.forEach(element => {
        songsUri.push(element.track);
      });
      setDuration(track?.track.duration_ms);
      setQueue(songsUri);
    } else {
      spotifyApi.play({
        uris: [track?.track.uri],
      });
      const songsUri =[];
      playlist.tracks.items.map((track) =>{
        songsUri.push(track.track);
      })
      setDuration(track?.track.duration_ms);
      setQueue(songsUri);
    }
  };

  useEffect(() => {
    if(albumTrack){
      spotifyApi
      .getAlbum(router.query.id)
      .then((data) => {
        setImage(data.body.images?.[0]?.url);
      })
      .catch((err) =>
        console.log("Something went wrong when retrieving images!" + err)
      );
    }
  });

  return (
    <div
      className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900
    rounded-lg cursor-pointer"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          className="h-10 w-10 xxs:w-8 xxs:h-8"
          src={track?.track.album.images?.[0]?.url ?? image}
          alt=""
        />
        <div className="hidden xs:block">
          <p className="w-36 md:w-64 lg:w-80 truncate text-white">
            {track?.track.name ?? albumTrack.name}
          </p>
          <p className="w-40">
            {track?.track.artists[0].name ?? albumTrack.artists[0].name}
          </p>
        </div>
      </div>

      <div className="hidden xs:flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden sm:inline">
          {track?.track.album.name ?? albumTrack.name}
        </p>
        <p>
          {millisToMinutesAndSeconds(
            track?.track.duration_ms ?? albumTrack.duration_ms
          )}
        </p>
      </div>
    </div>
  );
}

export default Song;