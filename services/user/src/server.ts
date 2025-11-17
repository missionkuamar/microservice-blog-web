import express from 'express'
import dotenv from 'dotenv'
import connectDb from './utils/db.js';
import userRouter from './routes/user.js';
dotenv.config();
const app = express()
const port =  process.env.PORT || 3000;
// api routes
app.use('/api/v1', userRouter);
app.get('/', (req, res) => {
  res.send('Hello World!')
})
// connect to database
connectDb();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



