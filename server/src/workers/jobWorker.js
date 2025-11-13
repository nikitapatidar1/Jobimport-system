// import { Worker } from "bullmq";
// import axios from "axios";
// import xml2js from "xml2js";
// import { redis } from "../config/redis.js";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import crypto from "crypto";
// import Job from "../models/job.js";
// import ImportLog from "../models/ImportLog.js";

// dotenv.config();

// // ✅ Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // ✅ Worker for job-import-queue
// const worker = new Worker(
//   "job-import-queue",
//   async (job) => {
//     const { feedUrl, fileName } = job.data;
//     console.log(`⚙️ Processing: ${fileName} — ${feedUrl}`);

//     const startTime = Date.now();
//     let totalFetched = 0,
//       totalImported = 0,
//       newJobs = 0,
//       updatedJobs = 0,
//       failedJobs = [];

//     try {
//       // 1️⃣ Fetch XML
//       const { data } = await axios.get(feedUrl, { timeout: 15000 });

//       // 2️⃣ Convert XML → JSON
//       const parsed = await xml2js.parseStringPromise(data, {
//         explicitArray: false,
//       });

//       // 3️⃣ Extract job list
//       const items = parsed.rss?.channel?.item || [];
//       const jobs = Array.isArray(items) ? items : [items];
//       totalFetched = jobs.length;

//       // 4️⃣ Process each job
//       for (const j of jobs) {
//         try {
//           // ✅ Generate unique externalId
//           const externalId =
//             j.guid ||
//             j.id ||
//             (j.link
//               ? crypto.createHash("md5").update(j.link).digest("hex")
//               : crypto
//                   .createHash("md5")
//                   .update(j.title + "_" + (j.pubDate || ""))
//                   .digest("hex"));

//           // ✅ Generate unique jobId fallback to avoid duplicate key errors
//           const jobId =
//             j.jobId ||
//             j.guid ||
//             crypto
//               .createHash("md5")
//               .update(j.link || j.title)
//               .digest("hex");

//           // ✅ Construct payload only with schema fields
//           const payload = {
//             externalId,
//             jobId,
//             title: j.title || "",
//             company: j["company"] || j["author"] || j["dc:creator"] || "",
//             location: j["location"] || "",
//             description: j["description"] || "",
//             url: j.link || "",
//             category: j["category"] || "",
//             jobType: j["jobType"] || "",
//             salary: j["salary"] || "",
//             postedAt: j.pubDate ? new Date(j.pubDate) : new Date(),
//             raw: j,
//           };

//           // ✅ Upsert safely using externalId
//           const result = await Job.updateOne(
//             { externalId },
//             { $set: payload },
//             { upsert: true }
//           );

//           if (result.upsertedCount) newJobs++;
//           else updatedJobs++;

//           totalImported++;
//         } catch (err) {
//           failedJobs.push({
//             externalId: j.guid || j.id || j.link || j.title,
//             reason: err.message,
//           });
//         }
//       }

//       // 5️⃣ Log import results
//       const durationMs = Date.now() - startTime;
//       await ImportLog.create({
//         feedUrl,
//         fileName,
//         totalFetched,
//         totalImported,
//         newJobs,
//         updatedJobs,
//         failedJobs,
//         durationMs,
//       });

//       console.log(
//         `✅ Done ${fileName}: fetched ${totalFetched}, imported ${totalImported} (${newJobs} new, ${updatedJobs} updated)`
//       );
//     } catch (err) {
//       console.error(`❌ Import failed for ${fileName}:`, err.message);
//     }
//   },
//   { connection: redis, concurrency: 5 }
// );

// // ✅ Event listeners
// worker.on("completed", (job) =>
//   console.log(`🎉 Job ${job.id} completed successfully`)
// );
// worker.on("failed", (job, err) =>
//   console.error(`💥 Job ${job.id} failed: ${err.message}`)
// );

import { Worker } from "bullmq";
import axios from "axios";
import xml2js from "xml2js";
import { redis } from "../config/redis.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";
import Job from "../models/job.js";
import ImportLog from "../models/ImportLog.js";

dotenv.config();

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ Worker for job-import-queue
const worker = new Worker(
  "job-import-queue",
  async (job) => {
    const { feedUrl, fileName } = job.data;
    console.log(`⚙️ Processing feed: ${fileName} — ${feedUrl}`);

    const startTime = Date.now();
    let totalFetched = 0;
    let newJobs = 0;
    let updatedJobs = 0;
    let failedJobs = [];

    try {
      // 1️⃣ Fetch XML
      const { data } = await axios.get(feedUrl, { timeout: 15000 });

      // 2️⃣ Convert XML → JSON
      const parsed = await xml2js.parseStringPromise(data, {
        explicitArray: false,
      });

      // 3️⃣ Extract job list
      const items = parsed.rss?.channel?.item || [];
      let jobs = Array.isArray(items) ? items : [items];
      totalFetched = jobs.length;

      // 4️⃣ Deduplicate jobs within the feed (based on guid/id/link/title)
      const seen = new Set();
      jobs = jobs.filter((j) => {
        const id = j.guid || j.id || j.link || j.title;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
      totalFetched = jobs.length; // update after deduplication

      // 5️⃣ Process each job
      for (const j of jobs) {
        try {
          // ✅ Generate unique externalId
          const externalId =
            j.guid ||
            j.id ||
            (j.link
              ? crypto.createHash("md5").update(j.link).digest("hex")
              : crypto
                  .createHash("md5")
                  .update(j.title + "_" + (j.pubDate || ""))
                  .digest("hex"));

          // ✅ Construct payload
          const payload = {
            externalId,
            title: j.title || "",
            company: j["company"] || j["author"] || j["dc:creator"] || "",
            location: j["location"] || "",
            description: j["description"] || "",
            url: j.link || "",
            category: j["category"] || "",
            jobType: j["jobType"] || "",
            salary: j["salary"] || "",
            postedAt: j.pubDate ? new Date(j.pubDate) : new Date(),
            raw: j,
          };

          // ✅ Upsert safely using externalId
          const result = await Job.updateOne(
            { externalId },
            { $set: payload },
            { upsert: true }
          );

          if (result.upsertedCount > 0) newJobs++;
          else updatedJobs++;
        } catch (err) {
          failedJobs.push({
            externalId: j.guid || j.id || j.link || j.title,
            reason: err.message,
          });
        }
      }

      // 6️⃣ Log **one entry per feed**
      await ImportLog.create({
        feedUrl,
        fileName,
        totalFetched,
        totalImported: newJobs + updatedJobs,
        newJobs,
        updatedJobs,
        failedJobs, // array of failed jobs
        durationMs: Date.now() - startTime,
      });

      console.log(
        `✅ Done ${fileName}: Fetched=${totalFetched}, Imported=${
          newJobs + updatedJobs
        } (New=${newJobs}, Updated=${updatedJobs}, Failed=${failedJobs.length})`
      );
    } catch (err) {
      console.error(`❌ Feed import failed for ${fileName}:`, err.message);

      // Log even if feed fails completely
      await ImportLog.create({
        feedUrl,
        fileName,
        totalFetched: 0,
        totalImported: 0,
        newJobs: 0,
        updatedJobs: 0,
        failedJobs: [{ reason: err.message }],
        durationMs: Date.now() - startTime,
      });
    }
  },
  { connection: redis, concurrency: 5 }
);

// ✅ Event listeners
worker.on("completed", (job) =>
  console.log(`🎉 Job ${job.id} completed successfully`)
);
worker.on("failed", (job, err) =>
  console.error(`💥 Job ${job.id} failed: ${err.message}`)
);

export default worker;
