import mongoose from "mongoose";

let isConnected = false;

export const connectToMongoDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    console.log("MONGODB_URL not found!!!");
    return;
  }

  if (isConnected) {
    console.log("MongoDB already connected.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true;

    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.log("error :>>", error);
  }
};
