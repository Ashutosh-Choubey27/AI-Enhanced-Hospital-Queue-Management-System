import { Bell, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Search patients, doctors, tokens…" />
          </div>
        </div>
        <button className="btn btn-ghost">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Alerts</span>
        </button>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
          <div className="h-8 w-8 rounded-xl bg-slate-100" />
          <div className="hidden sm:block leading-tight">
            <div className="text-xs font-semibold text-slate-900">Ashutosh</div>
            <div className="text-[11px] text-slate-500">Patient</div>
          </div>
        </div>
      </div>
    </header>
  );
}

