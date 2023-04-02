require("dotenv").config();

export const env = {
  DATABASE_URL:
    process.env.DATABASE_URL ?? "mongodb://localhost:27017/Licenta",
  STINGER :  "stinger",
  USER_MANAGEMENT: "user",
  PORT: 3000
};
