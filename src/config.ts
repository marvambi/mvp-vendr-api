import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  mongodbURI: 'mongodb://localhost:27017/vender',
  // mongodbURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/vender',
  jwtSecret: process.env.JWT_SECRET || '5ytjjfbPK8ZJ',
};
