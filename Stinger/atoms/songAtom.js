import { atom } from "recoil";

export const currentTrackIdState = atom({
  key: "currentTrackIdState",
  default: null,
});

export const isPlayingState = atom({
  key: "isPlayingState",
  default: false,
});

export const isRepeatState = atom({
  key: "isRepeatState",
  default: false,
});

export const isShuffleState = atom({
  key: "isShuffleState",
  default: false,
});

export const volumeState = atom({
  key: "volumeState",
  default: 50,
});
