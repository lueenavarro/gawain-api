import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { Task, TaskList } from "schemas";

let mongoServer: MongoMemoryServer;

export const startMockDB = async () => {
  mongoServer = new MongoMemoryServer({
    binary: {
      version: "4.2.3",
    },
  });
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};

export const stopMockDB = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

export const clearMockDB = async () => {
  await Task.deleteMany({});
  await TaskList.deleteMany({});
};
