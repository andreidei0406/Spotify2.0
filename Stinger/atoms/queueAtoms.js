import { atom } from "recoil";

export const queueState = atom({
  key: "queueState",
  default: null,
});

export const oldQueueState = atom({
  key: "oldQueueState",
  default: null,
});

export const queueIdState = atom({
  key: "queueIdState",
  default: "",
});
