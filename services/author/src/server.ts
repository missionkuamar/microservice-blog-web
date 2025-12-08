import express from 'express';
import dotenv from "dotenv";
dotenv.config();
const app = express();

const port = 5001
app.listen(port , () => {
    console.log(`Server is runnin on https on ${port}`);
})