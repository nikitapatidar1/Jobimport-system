// server/importJobs.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { importJobsFromAPI } from "./src/workers/jobWorker.js";

dotenv.config();

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/artha-job-board";

(async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected!");

    await importJobsFromAPI("https://jobicy.com/?feed=job_feed", "jobicy.xml");
    console.log("Import completed!");

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
})();
