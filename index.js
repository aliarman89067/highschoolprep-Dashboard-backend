// Libs
import cors from "cors";
import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
// Routes
import userRoute from "./routes/userRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import careerFormRoute from "./routes/CareerForm.js";
import trafficRoute from "./routes/Traffic.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use("/api/users", userRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/career-forms", careerFormRoute);
app.use("/api/traffic", trafficRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(4000, () => {
      console.log("App is running on port 4000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
