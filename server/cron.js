// import cron from "node-cron";
// import { jobQueue } from "./src/queues/jobQueue.js"; // correct path

// const feeds = [
//   { feedUrl: "https://jobicy.com/?feed=job_feed", fileName: "jobicy.xml" },
//   {
//     feedUrl:
//       "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
//     fileName: "smm.xml",
//   },
//   {
//     feedUrl:
//       "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
//     fileName: "design.xml",
//   },
//   {
//     feedUrl: "https://www.higheredjobs.com/rss/articleFeed.cfm",
//     fileName: "higheredjobs.xml",
//   },
// ];

// cron.schedule("* * * * *", async () => {
//   // har 1 minute me
//   console.log("🕒 Cron running - enqueueing jobs...");

//   try {
//     for (const feed of feeds) {
//       await jobQueue.add("import-job", feed);
//       console.log(`✅ Enqueued job for ${feed.fileName}`);
//     }
//   } catch (err) {
//     console.error("❌ Cron enqueue error:", err);
//   }
// });

import cron from "node-cron";
import { jobQueue } from "./src/queues/jobQueue.js"; // path correct hai

// Feeds array
const feeds = [
  { feedUrl: "https://jobicy.com/?feed=job_feed", fileName: "jobicy.xml" },
  {
    feedUrl:
      "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
    fileName: "smm.xml",
  },
  {
    feedUrl:
      "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
    fileName: "design.xml",
  },
  {
    feedUrl: "https://www.higheredjobs.com/rss/articleFeed.cfm",
    fileName: "higheredjobs.xml",
  },
];

// Schedule: har 1 minute ke liye (task me hourly keh rahe the, test ke liye 1 min)
cron.schedule("0 * * * *", async () => {
  console.log("🕒 Cron running - enqueueing jobs...");

  try {
    for (const feed of feeds) {
      // ✅ Add job only once per feed per cron run
      await jobQueue.add("import-job", feed, {
        jobId: feed.fileName,
        removeOnComplete: true,
        removeOnFail: true,
      });
      console.log(`✅ Enqueued job for ${feed.fileName}`);
    }
  } catch (err) {
    console.error("❌ Cron enqueue error:", err);
  }
});
