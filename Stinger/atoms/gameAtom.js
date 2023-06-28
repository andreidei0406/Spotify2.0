import { atom } from "recoil";

export const gameSongState = atom({
  key: "gameSongState",
  default: null,
});

export const gameArtistState = atom({
  key: "gameArtistState",
  default: null,
});
