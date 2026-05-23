import clsx from "clsx";

const STYLES = {
  PAID: "badge-green",
  DUE: "badge-amber",
  PENDING: "badge-amber",
  FAILED: "badge-red",
  REFUNDED: "badge-blue",
  ACTIVE: "badge-green",
  INACTIVE: "badge-red",
  BOOKED: "badge-blue",
  CHECKED_IN: "badge-amber",
  IN_QUEUE: "badge-amber",
  COMPLETED: "badge-green",
  CANCELLED: "badge-red",
  NO_SHOW: "badge-red",
  CALLED: "badge-blue",
  WAITING: "badge-amber",
  DONE: "badge-green",
};

export function StatusBadge({ status, className }) {
  const key = String(status || "").toUpperCase();
  return <span className={clsx("badge", STYLES[key] || "", className)}>{status}</span>;
}
