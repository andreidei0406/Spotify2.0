import { atom } from "recoil";

export const seekerState = atom({
  key: "seekerState",
  default: 0,
});

export const seekerIdState = atom({
  key: "seekerIdState",
  default: "",
});
