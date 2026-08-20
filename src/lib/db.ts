import dns from "dns";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Local/router DNS often times out on MongoDB Atlas SRV + TXT lookups.
if (process.env.MONGODB_USE_PUBLIC_DNS !== "false") {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not defined. Copy .env.example to .env.local and add your MongoDB connection string, then restart the dev server.",
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;

    const message =
      error instanceof Error ? error.message : "Unknown MongoDB connection error";

    if (message.includes("ETIMEOUT") || message.includes("queryTxt")) {
      throw new Error(
        "MongoDB DNS lookup timed out. Use the standard connection string from Atlas (mongodb://...) instead of mongodb+srv:// in .env.local, or change your DNS to 8.8.8.8 / 1.1.1.1.",
      );
    }

    throw error;
  }

  return cached.conn;
}

export default connectDB;
