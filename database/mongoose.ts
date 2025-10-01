import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  // For hot-reload in Next.js
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (!MONGODB_URI) {
    throw new Error(
      "❌ MONGODB_URI is not set in .env file. Example:\n" +
      "MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/stockdb"
    );
  }

  // ✅ Validate URI scheme
  if (
    !MONGODB_URI.startsWith("mongodb://") &&
    !MONGODB_URI.startsWith("mongodb+srv://")
  ) {
    throw new Error("❌ Invalid MongoDB URI. Must start with 'mongodb://' or 'mongodb+srv://'");
  }

  // ✅ Ensure DB name exists
  if (!MONGODB_URI.includes(".net/") || MONGODB_URI.endsWith(".net/")) {
    throw new Error(
      "❌ Your connection string is missing a database name.\n" +
      "Example:\n" +
      "mongodb+srv://username:password@cluster0.mongodb.net/stockdb"
    );
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .catch((err) => {
        console.error("❌ Failed to connect to MongoDB:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  console.log("✅ Connected to MongoDB");
  return cached.conn;
};
