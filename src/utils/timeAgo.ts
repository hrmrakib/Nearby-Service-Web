export function timeAgo(isoString: string): string {
  const now = new Date();
  const past = new Date(isoString);
  const diffMs = now.getTime() - past.getTime();

  if (diffMs < 0) return "just now";

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = Math.floor(totalDays / 30);
  const totalYears = Math.floor(totalDays / 365);

  if (totalYears > 0)
    return `${totalYears} year${totalYears > 1 ? "s" : ""} ago`;
  if (totalMonths > 0)
    return `${totalMonths} month${totalMonths > 1 ? "s" : ""} ago`;
  if (totalWeeks > 0)
    return `${totalWeeks} week${totalWeeks > 1 ? "s" : ""} ago`;
  if (totalDays > 0) return `${totalDays} day${totalDays > 1 ? "s" : ""} ago`;
  if (totalHours > 0)
    return `${totalHours} hour${totalHours > 1 ? "s" : ""} ago`;
  if (totalMinutes > 0)
    return `${totalMinutes} minute${totalMinutes > 1 ? "s" : ""} ago`;
  return `${totalSeconds} second${totalSeconds !== 1 ? "s" : ""} ago`;
}
