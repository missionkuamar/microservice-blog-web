import express from "express";
import dotenv from "dotenv";
import blogRoutes from "./routes/blog.js";
import { createClient } from "redis";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

export const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: false,
  }
});

redisClient
  .connect()
  .then(() => {
    console.log("🔥 Redis connected");
  })
  .catch((err) => {
    console.log("⚠️ Redis failed to connect:", err.message);
  });

redisClient.on("error", (err) => {
  console.log("⚠️ Redis error (ignored):", err.message);
});

app.use("/api/v1", blogRoutes);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
