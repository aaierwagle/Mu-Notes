import mongoose from "mongoose";

// Ensure environment variables are defined before using them
const dbUserName = process.env.DB_USER_NAME!;
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD!);
const dbName = process.env.DB_NAME!;
const dbHost = process.env.DB_HOST!;

const dbURL = `mongodb+srv://${dbUserName}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("DB connection established...");
  } catch (error: unknown) { // Explicitly typing error as unknown
    if (isError(error)) { // Type guard for standard error
      console.log(error.message);
    } else {
      console.log("An unknown error occurred");
    }
    console.log("DB connection failed...");
  }
};

// Type guard to check if the error is an instance of Error
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export default connectDB;
