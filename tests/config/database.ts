import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";

let mongoServer: MongoMemoryServer;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let connection: MongoClient;

const connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  connection = await MongoClient.connect(mongoServer.getUri(), {});
  console.log("Connection: ", connection.listeners);
};

const close = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

const clear = async () => {
  const { collections } = mongoose.connection;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

export default { connect, close, clear };
