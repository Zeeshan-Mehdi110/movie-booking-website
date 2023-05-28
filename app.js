import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-routes";
import adminRouter from "./routes/admin-routes";
import movieRouter from "./routes/movie-routes";
import bookingsRouter from "./routes/booking-routes";
import cors from "cors";
dotenv.config();
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);

mongoose
  .connect(process.env.MONGODB_CONNECTION_URL)
  .then(() => {
    console.log('database connected successfully!!')
  })
  .catch((error) => {
    console.log(error)
  })

app.use((err, req, res, next) => {
  if (err) res.status(400).json({ error: err.message })
  else next()
})
app.listen(5000, () => console.log('server is listening at port 5000'))
