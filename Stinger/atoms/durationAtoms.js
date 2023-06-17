import { atom } from "recoil";

export const durationState = atom({
  key: "durationState",
  default: 0,
});

export const durationIdState = atom({
  key: "durationIdState",
  default: "",
});
