import express from "express";
import { jobQueue } from "../queues/jobQueue.js";
import ImportLog from "../models/importLog.js";
const router = express.Router();

// router.post("/import", async (req, res) => {
//   const { feedUrl, fileName } = req.body;
//   await jobQueue.add("import-job", { feedUrl, fileName });
//   res.json({ message: "Job added to queue" });
// });

router.post("/import", async (req, res) => {
  try {
    const { feedUrl, fileName } = req.body;
    await jobQueue.add("import-job", { feedUrl, fileName });
    res.json({ message: "Job added to queue" });
  } catch (err) {
    console.error("Import route error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/logs", async (req, res) => {
  const logs = await ImportLog.find().sort({ timestamp: -1 });
  res.json(logs);
});

export default router;
