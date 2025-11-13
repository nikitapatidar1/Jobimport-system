// import { Redis } from "ioredis";
// export const redis = new Redis(
//   process.env.REDIS_URL || "redis://127.0.0.1:6379"
// );

import IORedis from "ioredis";

export const redis = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null, // ✅ ye line add karni hai
});
