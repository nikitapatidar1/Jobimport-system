// import mongoose from "mongoose";

// const jobSchema = new mongoose.Schema(
//   {
//     externalId: { type: String, required: true, unique: true, index: true },
//     title: String,
//     company: String,
//     location: String,
//     description: String,
//     url: String,
//     category: String,
//     jobType: String,
//     salary: String,
//     postedAt: Date,
//     raw: mongoose.Schema.Types.Mixed,
//   },
//   { timestamps: true }
// );

// const Job = mongoose.model("Job", jobSchema);
// export default Job;

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true, index: true },
    jobId: { type: String }, // ✅ add this
    title: { type: String, default: "" },
    company: { type: String, default: "" },
    location: { type: String, default: "" },
    description: { type: String, default: "" },
    url: { type: String, default: "" },
    category: { type: String, default: "" },
    jobType: { type: String, default: "" },
    salary: { type: String, default: "" },
    postedAt: { type: Date, default: Date.now },
    raw: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
