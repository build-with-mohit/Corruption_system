import type { Complaint } from "../api";

export function getStatusBadge(status: Complaint["status"]) {
  switch (status) {
    case "pending":
      return { label: "Pending", className: "badge-pending" };
    case "under_investigation":
      return { label: "In Progress", className: "badge-investigation" };
    case "resolved":
      return { label: "Resolved", className: "badge-resolved" };
    case "rejected":
      return { label: "Rejected", className: "badge-rejected" };
    default:
      return { label: status, className: "badge-pending" };
  }
}

export function formatDate(dateStr: string, opts?: { short?: boolean }) {
  const d = new Date(dateStr);
  if (opts?.short) {
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
