import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import jobRoutes from "./routes/jobRoutes.js";
import "./queues/worker.js";
// import "../cron.js"; // ek level upar jaake cron.js ko import karo
import "../cron.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/jobs", jobRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log("🚀 Server running on port", process.env.PORT || 5000)
);
