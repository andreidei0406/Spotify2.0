import { atom } from "recoil";

export const likedState = atom({
  key: "likeState",
  default: null,
});

export const likedIdState = atom({
  key: "likedIdState",
  default: "",
});
