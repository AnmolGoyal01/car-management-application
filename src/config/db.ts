import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables"
      );
    }
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}` || ""
    );
    console.log(`\nMongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MONGODB connection Error : ", error);
    process.exit(1);
  }
};

export default connectDB;