import dotenv from "dotenv";
const envs = dotenv.config();

export default {
  port: envs.parsed?.PORT,
  mongodbURI: envs.parsed?.MONGODB_URI_DEV,
  jwtSecret: envs.parsed?.JWT_SECRET,
};
