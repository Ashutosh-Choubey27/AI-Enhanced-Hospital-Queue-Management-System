import { Activity, Clock3, Hospital, Users } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { mockAppointments, mockQueue } from "../mock/data";

function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-600">{label}</div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</div>
            {hint ? <div className="mt-2 text-xs text-slate-500">{hint}</div> : null}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentItem({ a }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div>
        <div className="text-sm font-semibold text-slate-900">{a.doctorName}</div>
        <div className="mt-1 text-xs text-slate-500">
          {a.department} • {a.when}
        </div>
      </div>
      <span className="badge badge-blue">{a.status}</span>
    </div>
  );
}

export default function Dashboard() {
  return (
    <PageShell title="Dashboard" subtitle="Overview of today’s flow, appointments, and queue health.">
      <div className="grid gap-4 lg:grid-cols-4">
        <StatCard
          label="Live queue (slot)"
          value={mockQueue.entries.filter((e) => e.status === "WAITING").length}
          hint={`${mockQueue.department} • ${mockQueue.slotLabel}`}
          icon={Activity}
        />
        <StatCard label="Current token" value={mockQueue.currentToken} hint="Now serving" icon={Clock3} />
        <StatCard label="Upcoming appointments" value={mockAppointments.upcoming.length} hint="Next 7 days" icon={Users} />
        <StatCard label="Facility status" value="Normal" hint="Peak predicted at 5–7 PM" icon={Hospital} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="text-sm font-semibold text-slate-900">Upcoming</div>
              <div className="mt-1 text-xs text-slate-500">Your next visits</div>
            </div>
            <button className="btn btn-ghost">View all</button>
          </div>
          <div className="card-body space-y-3">
            {mockAppointments.upcoming.map((a) => (
              <AppointmentItem key={a.id} a={a} />
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="text-sm font-semibold text-slate-900">Queue snapshot</div>
              <div className="mt-1 text-xs text-slate-500">{mockQueue.doctorName}</div>
            </div>
            <span className="badge badge-amber">Real-time</span>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold text-slate-600">Waiting</div>
                <div className="mt-2 text-xl font-bold text-slate-900">
                  {mockQueue.entries.filter((e) => e.status === "WAITING").length}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold text-slate-600">Emergency</div>
                <div className="mt-2 text-xl font-bold text-slate-900">
                  {mockQueue.entries.filter((e) => e.priority === "EMERGENCY" && e.status === "WAITING").length}
                </div>
              </div>
              <div className="col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <div className="text-xs font-semibold text-slate-600">Insight</div>
                <div className="mt-2 text-sm text-slate-700">
                  Emergency patients are prioritized first. No-shows can be skipped to keep the queue moving.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

