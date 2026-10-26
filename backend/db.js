import mongoose from "mongoose";

let dbPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (dbPromise) {
    return dbPromise;
  }

  let mongoUri =
    process.env.MONGO_URL ||
    "mongodb+srv://naveenkumar:Naveennani@cluster0.ogm15vv.mongodb.net/ai-medlab?retryWrites=true&w=majority";

  if (!mongoUri) {
    return null;
  }

  if (mongoUri.endsWith("/")) {
    mongoUri = `${mongoUri}ai-medlab?retryWrites=true&w=majority`;
  }

  dbPromise = mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
      dbName: "ai-medlab",
    })
    .then((conn) => {
      console.log("Mongoose connected");
      return conn;
    })
    .catch((error) => {
      dbPromise = null;
      console.error("Mongoose connection failed:", error.message);
      throw error;
    });

  return dbPromise;
};
