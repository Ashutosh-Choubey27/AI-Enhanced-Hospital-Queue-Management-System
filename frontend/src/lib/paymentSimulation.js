export const HOSPITAL_UPI_ID = "hospitalqueue@upi";
export const HOSPITAL_PAYEE_NAME = "AI Hospital Queue";

export function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export function generateTransactionId() {
  const suffix = Math.floor(10000 + Math.random() * 89999);
  return `HQM2026PAY${suffix}`;
}

export function buildUpiPayload({ amount, note = "Hospital billing" }) {
  const params = new URLSearchParams({
    pa: HOSPITAL_UPI_ID,
    pn: HOSPITAL_PAYEE_NAME,
    am: String(amount),
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

export function maskPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length < 4) return "+91 XXXXXXX901";
  return `+91 XXXXXXX${digits.slice(-3)}`;
}

export function maskEmail(email) {
  const e = String(email || "patient@hospital.care");
  const [user, domain] = e.split("@");
  if (!domain) return e;
  const visible = user.slice(0, 2);
  return `${visible}***@${domain}`;
}

export function formatPaymentTimestamp(date = new Date()) {
  return date.toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
