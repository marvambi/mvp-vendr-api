import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
const envs = dotenv.config();
const conn_uri = envs.parsed?.MONGODB_URI_DEV;
const connect = async () => {
  try {
    const options: ConnectOptions = {
      autoIndex: false, // Don't build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5
      socketTimeoutMS: 45000, // Close sockets after 45 seconds inactivity
      family: 4,
    };

    if (conn_uri === undefined) {
      return null;
    }
    await mongoose.connect(conn_uri, options);
  } catch (error) {
    console.error("Error: ", error);
    process.exit(1);
  }
};

export default connect;
