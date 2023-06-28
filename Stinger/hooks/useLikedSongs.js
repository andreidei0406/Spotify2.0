import { useEffect, useState } from "react";
import useSpotify from "./useSpotify";

var allSongs = [];

function useLikedSongs() {
  const spotifyApi = useSpotify();
  const [nextUrl, setNextUrl] = useState(
    "https://api.spotify.com/v1/me/tracks"
  );
  useEffect(() => {
    const fetchLikedSongs = async (url) => {
      const songs = await fetch(url, {
        headers: {
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
        },
        method: "GET",
      })
        .then((res) => res.json())
        .catch((err) => console.log("Unable to fetch liked songs", err));
      console.log(songs);
      songs.items.map((track) => {
        allSongs.push(track.track);
      })
      if (songs.next !== null) {
        setNextUrl(songs.next);
      }
      console.log(nextUrl);
    };
    fetchLikedSongs(nextUrl);
  }, [spotifyApi, nextUrl]);

  return allSongs;
}

export default useLikedSongs;
