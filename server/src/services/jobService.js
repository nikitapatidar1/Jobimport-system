// import axios from "axios";
// import Job from "../models/job.js";
// // import ImportLog from "../models/importLog.js";
// import ImportLog from "../models/ImportLog.js";

// import { xmlToJson } from "./xmlParser.js";
// import crypto from "crypto";

// export const importJobsFromAPI = async (feedUrl, fileName) => {
//   const startTime = Date.now(); // 🕒 Track duration
//   try {
//     const { data } = await axios.get(feedUrl);
//     const json = await xmlToJson(data);
//     const items = json?.rss?.channel?.item;

//     // ⚠️ FIX #1: Wrong field name 'failedCount' → use 'failedJobs'
//     if (!items) {
//       console.warn(`⚠️ No items found in feed: ${fileName}`);
//       await ImportLog.create({
//         feedUrl,
//         fileName,
//         totalFetched: 0,
//         totalImported: 0,
//         newJobs: 0,
//         updatedJobs: 0,
//         failedJobs: 1, // ✅ correct field
//         failedReasons: "No items found in feed",
//         durationMs: Date.now() - startTime,
//       });
//       return;
//     }

//     const jobsArray = Array.isArray(items) ? items : [items];

//     // ✅ initialize counters
//     let total = 0;
//     let newCount = 0;
//     let updatedCount = 0;
//     let failedCount = 0;
//     let failedReasons = [];

//     for (const job of jobsArray) {
//       const externalId =
//         (job.guid && job.guid._) ||
//         (job.id && job.id._) ||
//         crypto
//           .createHash("md5")
//           .update(job.link || job.title || JSON.stringify(job))
//           .digest("hex");

//       const payload = {
//         externalId,
//         title: job.title || "",
//         company: job.company || job.author || job["dc:creator"] || "",
//         location: job.location || "",
//         description: job.description || "",
//         url: job.link || "",
//         postedAt: job.pubDate ? new Date(job.pubDate) : new Date(),
//         raw: job,
//       };

//       try {
//         const result = await Job.updateOne(
//           { externalId },
//           { $set: payload },
//           { upsert: true }
//         );

//         if (result.upsertedCount > 0) newCount++;
//         else updatedCount++;

//         total++;
//       } catch (err) {
//         failedCount++;
//         failedReasons.push(`ID: ${externalId} - ${err.message}`);
//         total++;
//       }
//     }

//     // ✅ FIX #2: add `totalImported` and `durationMs` properly
//     await ImportLog.create({
//       feedUrl,
//       fileName,
//       totalFetched: total,
//       totalImported: newCount + updatedCount,
//       newJobs: newCount,
//       updatedJobs: updatedCount,
//       failedJobs: failedCount,
//       failedReasons: failedReasons.join(" | "),
//       durationMs: Date.now() - startTime,
//     });

//     console.log(
//       `✅ ${fileName} → Total: ${total}, New: ${newCount}, Updated: ${updatedCount}, Failed: ${failedCount}`
//     );
//   } catch (err) {
//     console.error(`❌ Job import failed for ${fileName}:`, err.message);

//     // ✅ FIX #3: uniform naming (failedJobs instead of failedCount)
//     await ImportLog.create({
//       feedUrl,
//       fileName,
//       totalFetched: 0,
//       totalImported: 0,
//       newJobs: 0,
//       updatedJobs: 0,
//       failedJobs: 1,
//       failedReasons: err.message,
//       durationMs: 0,
//     });
//   }
// };

import axios from "axios";
import Job from "../models/job.js";
import ImportLog from "../models/ImportLog.js";
import { xmlToJson } from "./xmlParser.js";
import crypto from "crypto";

export const importJobsFromAPI = async (feedUrl, fileName) => {
  const startTime = Date.now();

  try {
    const { data } = await axios.get(feedUrl);
    const json = await xmlToJson(data);
    const items = json?.rss?.channel?.item;

    if (!items) {
      console.warn(`⚠️ No items in feed: ${fileName}`);
      await ImportLog.create({
        feedUrl,
        fileName,
        totalFetched: 0,
        totalImported: 0,
        newJobs: 0,
        updatedJobs: 0,
        failedJobs: 1,
        failedReasons: "No items found",
        durationMs: Date.now() - startTime,
      });
      return;
    }

    const jobsArray = Array.isArray(items) ? items : [items];

    // ✅ counters
    let newCount = 0;
    let updatedCount = 0;
    let failedCount = 0;
    let failedReasons = [];

    // ⚡ Process all jobs, but count new/updated/failures
    for (const job of jobsArray) {
      const externalId =
        (job.guid && job.guid._) ||
        (job.id && job.id._) ||
        crypto
          .createHash("md5")
          .update(job.link || job.title || JSON.stringify(job))
          .digest("hex");

      const payload = {
        externalId,
        title: job.title || "",
        company: job.company || job.author || job["dc:creator"] || "",
        location: job.location || "",
        description: job.description || "",
        url: job.link || "",
        postedAt: job.pubDate ? new Date(job.pubDate) : new Date(),
        raw: job,
      };

      try {
        const result = await Job.updateOne(
          { externalId },
          { $set: payload },
          { upsert: true }
        );

        if (result.upsertedCount > 0) newCount++;
        else if (result.matchedCount > 0) updatedCount++;
      } catch (err) {
        failedCount++;
        failedReasons.push(`ID: ${externalId} - ${err.message}`);
      }
    }

    // ✅ SINGLE log entry per feed fetch
    await ImportLog.create({
      feedUrl,
      fileName,
      totalFetched: jobsArray.length,
      totalImported: newCount + updatedCount,
      newJobs: newCount,
      updatedJobs: updatedCount,
      failedJobs: failedCount,
      failedReasons: failedReasons.join(" | "),
      durationMs: Date.now() - startTime,
    });

    console.log(
      `✅ ${fileName} → Total: ${jobsArray.length}, New: ${newCount}, Updated: ${updatedCount}, Failed: ${failedCount}`
    );
  } catch (err) {
    console.error(`❌ Import failed for ${fileName}:`, err.message);
    await ImportLog.create({
      feedUrl,
      fileName,
      totalFetched: 0,
      totalImported: 0,
      newJobs: 0,
      updatedJobs: 0,
      failedJobs: 1,
      failedReasons: err.message,
      durationMs: 0,
    });
  }
};
