import spotifyApi from "@/lib/spotify";
import { useEffect } from "react";

function useSdk() {
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = spotifyApi.getAccessToken();
      const player = new Spotify.Player({
        name: "Web Playback SDK Quick Start Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      // Ready
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("account_error", ({ message }) => {
        console.error(message);
      });

      document.getElementById("togglePlay").onclick = function () {
        player.togglePlay();
      };

      player.connect();
    };
  });

  return <script src="https://sdk.scdn.co/spotify-player.js"></script>;
}

export default useSdk;
