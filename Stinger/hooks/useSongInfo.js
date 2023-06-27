import { currentTrackIdState } from "@/atoms/songAtom";
import useSpotify from "./useSpotify";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";

function useSongInfo() {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
            method: 'GET'
          }
        ).then((res) => res.json()).catch((err) => console.log("Unable to fetch song info", err));

        setSongInfo(trackInfo);
      }
    };
    fetchSongInfo();
  }, [currentTrackId, spotifyApi]);

  return songInfo;
}

export default useSongInfo;
