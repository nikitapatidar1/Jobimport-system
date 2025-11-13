// server/src/routes/api.js (example)
import express from "express";
import axios from "axios";
const router = express.Router();

router.get("/fetch-feed", async (req, res) => {
  const { url } = req.query;
  try {
    const { data } = await axios.get(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
