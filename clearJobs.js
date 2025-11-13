import { jobQueue } from "./server/src/queues/jobQueue.js";

async function clearOldJobs() {
  try {
    await jobQueue.drain(); // Waiting + delayed jobs delete
    await jobQueue.clean(0, 0); // Completed jobs delete
    await jobQueue.clean(0, 1); // Failed jobs delete
    console.log("🧹 Old jobs cleared from queue");
    process.exit(0); // script complete ho gaya
  } catch (err) {
    console.error("❌ Error clearing jobs:", err);
    process.exit(1);
  }
}

clearOldJobs();
