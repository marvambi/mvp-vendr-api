import mongoose, { ConnectOptions } from 'mongoose';
import config from '../config';

const connect = async () => {
  console.log("Trying...")
  // return mongoose.connect(config.mongodbURI
  // ).then(() => console.log('Connected'))
  //   .catch(e => console.log('Error: ', e))
  try {
    const options: ConnectOptions = {
      autoIndex: false, // Don't build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5
      socketTimeoutMS: 45000, // Close sockets after 45 seconds inactivity
      family: 4,
    };

    await mongoose.connect(config.mongodbURI, options);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error("Error: ", error);
    process.exit(1);
  }
};

export default connect;
