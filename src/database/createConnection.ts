import mongoose from "mongoose";

export const createDatabaseConnection = () =>
  mongoose.connect(process.env.DB_URI || "mongodb://localhost:27017/onestep", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
