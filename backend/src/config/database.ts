import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error("Set MONGODB_URI in backend/.env before starting the backend.");
  }

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  await mongoose.connect(uri);
}
