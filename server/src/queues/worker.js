// import { Worker } from "bullmq";
// import { redis } from "../config/redis.js";
// import { importJobsFromAPI } from "../services/jobService.js";

// export const worker = new Worker(
//   "job-import-queue",
//   async (job) => {
//     console.log("⚡ Processing job:", job.data.fileName); // ← yahan console

//     const { feedUrl, fileName } = job.data;
//     try {
//       await importJobsFromAPI(feedUrl, fileName);
//       console.log("✅ Job processed successfully:", fileName); // ← yahan bhi
//     } catch (err) {
//       console.error("❌ Job processing error:", err.message); // error ka console
//     }
//   },
//   { connection: redis }
// );

import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { importJobsFromAPI } from "../services/jobService.js";

export const worker = new Worker(
  "job-import-queue",
  async (job) => {
    const { feedUrl, fileName } = job.data;
    console.log(`⚡ Processing job: ${fileName}`);
    try {
      await importJobsFromAPI(feedUrl, fileName);
      console.log(`✅ Successfully imported: ${fileName}`);
    } catch (err) {
      console.error(`❌ Job processing error for ${fileName}:`, err.message);
    }
  },
  { connection: redis }
);
