import { currentTrackIdState } from "@/atoms/songAtom";
import useSpotify from "./useSpotify";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { likedState } from "@/atoms/likedAtoms";

function useLikedSongs() {
  const spotifyApi = useSpotify();
  const [liked, setLiked] =
    useRecoilState(likedState);

  useEffect(() => {
    const fetchLikedSongs = async (url) => {
        const songs = await fetch(url,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
            method: 'GET'
          }
        ).then((res) => {res.json();
        console.log(res)}).catch((err) => console.log("Unable to fetch liked songs", err));

        setLiked(songs);
    }
    fetchLikedSongs(`https://api.spotify.com/v1/me/tracks/`);
  }, [spotifyApi]);

  return liked;
}

export default useLikedSongs;
