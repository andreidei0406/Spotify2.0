import { atom } from "recoil";

export const queueState = atom({
  key: "queueState",
  default: null,
});

export const queueIdState = atom({
  key: "queueIdState",
  default: "",
});
