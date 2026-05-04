// Simple in-memory (for demo)
// Replace with DB later

const userUsage: Record<string, number> = {};

export function checkLimit(userId: string) {
  const limit = 5; // free limit

  if (!userUsage[userId]) {
    userUsage[userId] = 0;
  }

  if (userUsage[userId] >= limit) {
    return false;
  }

  userUsage[userId]++;
  return true;
}