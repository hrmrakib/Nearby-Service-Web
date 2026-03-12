// formatISODate("2023-10-25T15:00:00Z") // → "Oct 25, 2023"

export function formatISODate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
