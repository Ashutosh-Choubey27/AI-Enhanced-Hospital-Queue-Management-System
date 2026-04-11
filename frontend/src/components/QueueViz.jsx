import { cn } from "../lib/cn";

function statusBadge(status) {
  switch (status) {
    case "CALLED":
      return "badge badge-blue";
    case "WAITING":
      return "badge badge-amber";
    case "DONE":
      return "badge badge-green";
    case "NO_SHOW":
      return "badge badge-red";
    default:
      return "badge";
  }
}

function priorityPill(priority) {
  if (priority === "EMERGENCY") return "badge badge-red";
  if (priority === "SENIOR") return "badge badge-blue";
  return "badge";
}

export function QueueViz({ entries, currentToken }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="text-sm font-semibold text-slate-900">Live Queue</div>
          <div className="mt-1 text-xs text-slate-500">Visual token lane + priority ordering</div>
        </div>
        <div className="badge badge-blue">Current token: {currentToken ?? "—"}</div>
      </div>
      <div className="card-body">
        <div className="grid gap-3">
          {entries.map((e) => (
            <div
              key={e.tokenNo}
              className={cn(
                "flex items-center justify-between gap-4 rounded-2xl border px-4 py-3",
                e.tokenNo === currentToken ? "border-brand-300 bg-brand-50" : "border-slate-200 bg-white"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold",
                    e.priority === "EMERGENCY" ? "bg-rose-600 text-white" : "bg-slate-900 text-white"
                  )}
                >
                  {e.tokenNo}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{e.name}</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className={priorityPill(e.priority)}>{e.priority}</span>
                    <span className={statusBadge(e.status)}>{e.status}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                {e.tokenNo === currentToken ? "In progress / called" : "In lane"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

