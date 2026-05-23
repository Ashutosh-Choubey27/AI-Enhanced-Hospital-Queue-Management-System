import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../feedback/ToastContext";

const QUICK_ROUTES = [
  { keys: ["book", "appointment", "doctor"], path: "/book", label: "Book Appointment" },
  { keys: ["queue", "token", "wait"], path: "/queue", label: "Live Queue" },
  { keys: ["appointment", "visit", "schedule"], path: "/appointments", label: "Appointments" },
  { keys: ["bill", "payment", "statement", "invoice"], path: "/statement", label: "Billing Statement" },
  { keys: ["profile", "account", "settings"], path: "/profile", label: "Profile" },
  { keys: ["dashboard", "analytics", "insight"], path: "/", label: "Dashboard" },
];

function matchRoute(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  for (const route of QUICK_ROUTES) {
    if (route.keys.some((k) => q.includes(k) || k.includes(q))) return route;
  }
  return null;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const toast = useToast();
  const nav = useNavigate();

  function runSearch(e) {
    e?.preventDefault();
    const q = query.trim();
    if (!q) {
      toast.info("Type a patient name, doctor, token, or page name to search.");
      return;
    }
    const hit = matchRoute(q);
    if (hit) {
      nav(hit.path);
      toast.success(`Opened ${hit.label}.`);
      setQuery("");
      return;
    }
    toast.info(`No exact match for “${q}”. Showing appointments list.`, { title: "Search" });
    nav("/appointments");
    setQuery("");
  }

  return (
    <form onSubmit={runSearch} className="flex-1">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="input-modern pl-9 transition-shadow"
          placeholder="Search patients, doctors, tokens…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Global search"
        />
        {focused && query ? (
          <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 sm:inline dark:bg-slate-800 dark:text-slate-400">
            Enter ↵
          </span>
        ) : null}
      </div>
    </form>
  );
}
