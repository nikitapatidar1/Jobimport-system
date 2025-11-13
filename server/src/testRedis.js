import { redis } from "./config/redis.js";

async function testConnection() {
  try {
    await redis.ping();
    console.log("✅ Redis connected successfully!");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  } finally {
    redis.disconnect();
  }
}

testConnection();
