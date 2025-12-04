// src/lib/utils/dateFormatter.ts

/**
 * Format date - Gregorian calendar (default for all pages)
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const formatter = new Intl.DateTimeFormat("ar-SY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formatter.format(dateObj);
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const formatter = new Intl.DateTimeFormat("ar-SY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formatter.format(dateObj);
}

// Aliases for backward compatibility
export const formatGregorianDate = formatDate;
export const formatGregorianDateTime = formatDateTime;

/**
 * Format date to short format (e.g., "15/03/2024")
 */
export function formatShortDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const formatter = new Intl.DateTimeFormat("ar-SY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(dateObj);
}

/**
 * Format relative time (e.g., "منذ 5 دقائق", "منذ ساعتين")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "منذ لحظات";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} ${diffInMinutes === 1 ? "دقيقة" : diffInMinutes === 2 ? "دقيقتين" : "دقائق"}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `منذ ${diffInHours} ${diffInHours === 1 ? "ساعة" : diffInHours === 2 ? "ساعتين" : "ساعات"}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `منذ ${diffInDays} ${diffInDays === 1 ? "يوم" : diffInDays === 2 ? "يومين" : "أيام"}`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `منذ ${diffInWeeks} ${diffInWeeks === 1 ? "أسبوع" : diffInWeeks === 2 ? "أسبوعين" : "أسابيع"}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `منذ ${diffInMonths} ${diffInMonths === 1 ? "شهر" : diffInMonths === 2 ? "شهرين" : "أشهر"}`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `منذ ${diffInYears} ${diffInYears === 1 ? "سنة" : diffInYears === 2 ? "سنتين" : "سنوات"}`;
}
