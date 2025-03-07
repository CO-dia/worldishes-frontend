const trackers: Record<string, { count: number; expiresAt: number }> = {};

export async function rateLimitByKey(
  key: string,
  limit: number = 3,
  duration: number = 10000 // 10 seconds
) {
  const response = { status: 200, error: "" };
  const tracker = trackers[key] || { count: 0, expiresAt: 0 };
  if (!trackers[key]) {
    trackers[key] = tracker;
  }

  if (tracker.expiresAt < Date.now()) {
    tracker.count = 0;
    tracker.expiresAt = Date.now() + duration;
  }

  tracker.count++;

  if (tracker.count > limit) {
    response.status = 429;
    response.error = "Rate limit exceeded";
  }

  return response;
}
