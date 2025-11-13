// import mongoose from "mongoose";
// const importLogSchema = new mongoose.Schema({
//   fileName: String,
//   totalFetched: Number,
//   newJobs: Number,
//   updatedJobs: Number,
//   failedJobs: Number,
//   failedReasons: Array,
//   timestamp: { type: Date, default: Date.now },
// });
// export default mongoose.model("ImportLog", importLogSchema);

// import mongoose from "mongoose";

// const importLogSchema = new mongoose.Schema({
//   feedUrl: String,
//   fileName: String,
//   timestamp: { type: Date, default: Date.now },
//   totalFetched: Number,
//   totalImported: Number,
//   newJobs: Number,
//   updatedJobs: Number,
//   failedJobs: [
//     {
//       externalId: String,
//       reason: String,
//     },
//   ],
//   durationMs: Number,
// });

// // Check if model already exists before defining
// const ImportLog =
//   mongoose.models.ImportLog || mongoose.model("ImportLog", importLogSchema);

// export default ImportLog;

import mongoose from "mongoose";

const importLogSchema = new mongoose.Schema({
  feedUrl: String,
  fileName: String,
  timestamp: { type: Date, default: Date.now },

  totalFetched: { type: Number, default: 0 },
  totalImported: { type: Number, default: 0 },
  newJobs: { type: Number, default: 0 },
  updatedJobs: { type: Number, default: 0 },

  // ✅ As per assignment:
  failedJobs: { type: Number, default: 0 }, // number of jobs failed

  // ✅ Optional: keep short reason summary (for debugging)
  failedReasons: { type: String, default: "" },

  durationMs: { type: Number, default: 0 },
});

const ImportLog =
  mongoose.models.ImportLog || mongoose.model("ImportLog", importLogSchema);

export default ImportLog;
