import { Queue } from "bullmq";
import { redis } from "./config/redis.js"; // make sure path is correct
import dotenv from "dotenv";
dotenv.config();

// Create a queue
const jobQueue = new Queue("job-import-queue", { connection: redis });

// Add a job
async function enqueue() {
  await jobQueue.add("import-job", {
    feedUrl: "https://jobicy.com/?feed=job_feed",
    fileName: "jobicy.xml",
  });

  console.log("✅ Job enqueued!");
  process.exit(0);
}

enqueue();
