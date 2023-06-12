import { atom } from "recoil";

export const categoriesState = atom({
  key: "categoriesState",
  default: null,
});

export const categoriesIdState = atom({
  key: "categoriesIdState",
  default: "",
});