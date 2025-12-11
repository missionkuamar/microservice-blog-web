import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import userRouter from "./routes/user.js";
import { v2 as cloudinary } from "cloudinary";
import cors from 'cors';
dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

const app = express();

app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

// routes
app.use("/api/v1", userRouter);

// test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// connect db
connectDb();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
