import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
  const uri =
    process.env.MONGODB_URI ??
    "mongodb://127.0.0.1:27017/dna-storage-simulator";

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  await mongoose.connect(uri);
}
