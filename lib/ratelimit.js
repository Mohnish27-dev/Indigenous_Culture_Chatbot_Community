// lib/rateLimit.js
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";


const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const ratelimit = new Ratelimit({
  redis,

  limiter: Ratelimit.slidingWindow(4, "1 m"),
});

/**
 * Helper to check the rate limit for an identifier (user email or IP).
 * Returns the raw limiter response which includes:
 * - success (boolean)
 * - limit (max allowed)
 * - remaining (calls left)
 * - reset (unix timestamp when the window resets)
 */
export async function checkRateLimit(identifier) {
  if (!identifier) identifier = "anon";
  return await ratelimit.limit(identifier);
}