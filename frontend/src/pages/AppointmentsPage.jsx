import { PageShell } from "../components/PageShell";
import { mockAppointments } from "../mock/data";

function Row({ a }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
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

export default function AppointmentsPage() {
  return (
    <PageShell title="Appointments" subtitle="Upcoming visits and consultation history." actions={<button className="btn btn-primary">Book new</button>}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="text-sm font-semibold text-slate-900">Upcoming</div>
              <div className="mt-1 text-xs text-slate-500">Next visits</div>
            </div>
          </div>
          <div className="card-body space-y-3">
            {mockAppointments.upcoming.map((a) => (
              <Row key={a.id} a={a} />
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="text-sm font-semibold text-slate-900">History</div>
              <div className="mt-1 text-xs text-slate-500">Past consultations</div>
            </div>
          </div>
          <div className="card-body space-y-3">
            {mockAppointments.history.map((a) => (
              <Row key={a.id} a={a} />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

