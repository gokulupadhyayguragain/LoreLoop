export function formatDate(value?: string | null, options: Intl.DateTimeFormatOptions = {}): string {
  if (!value) return "Waiting for first awakening";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", ...options }).format(date);
}

export function formatRelative(value?: string | null): string {
  if (!value) return "Not yet";
  const date = new Date(value);
  const delta = date.getTime() - Date.now();
  const minutes = Math.round(delta / 60000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
  return formatter.format(Math.round(hours / 24), "day");
}

export function formatEntityType(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export function scheduleLabel(value: string): string {
  return value.replace(/^rate\(/, "Every ").replace(/\)$/, "").replace(/ hours?/, " hours").replace(/ minutes?/, " minutes");
}

