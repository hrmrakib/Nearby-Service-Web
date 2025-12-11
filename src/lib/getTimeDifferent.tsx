import moment from "moment";

export type DateInput = string | number | Date;

export const getTimeDifference = (dateString: DateInput): string => {
  const now = moment();
  const date = moment(dateString);

  const years = now.diff(date, "years");
  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;

  const months = now.diff(date, "months");
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;

  const weeks = now.diff(date, "weeks");
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

  const days = now.diff(date, "days");
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;

  const hours = now.diff(date, "hours");
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const minutes = now.diff(date, "minutes");
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  const seconds = now.diff(date, "seconds");
  if (seconds < 10) return "just now";

  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
};
