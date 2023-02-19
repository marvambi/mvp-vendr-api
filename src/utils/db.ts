import mongoose, { ConnectOptions } from 'mongoose';
import config from '../config';

const connect = async () => {
  try {
    const options: ConnectOptions = {
      autoIndex: false, // Don't build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5
      socketTimeoutMS: 45000, // Close sockets after 45 seconds inactivity
      family: 4,
    };

    await mongoose.connect(config.mongodbURI, options);
  } catch (error) {
    console.error("Error: ", error);
    process.exit(1);
  }
};

export default connect;
