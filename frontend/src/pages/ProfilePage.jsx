import { PageShell } from "../components/PageShell";

export default function ProfilePage() {
  return (
    <PageShell title="Profile" subtitle="Personal details, preferences, and security.">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-slate-100" />
              <div>
                <div className="text-sm font-bold text-slate-900">Ashutosh</div>
                <div className="mt-1 text-xs text-slate-500">Patient</div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-800">Phone:</span> +91 98xxxxxx12
              </div>
              <div>
                <span className="font-semibold text-slate-800">Email:</span> ashut@example.com
              </div>
              <div>
                <span className="font-semibold text-slate-800">City:</span> Pune
              </div>
            </div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <div className="card-header">
            <div>
              <div className="text-sm font-semibold text-slate-900">Settings</div>
              <div className="mt-1 text-xs text-slate-500">Update info</div>
            </div>
          </div>
          <div className="card-body space-y-3">
            <div className="grid gap-3 lg:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-700">Name</label>
                <input className="input mt-2" defaultValue="Ashutosh" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Phone</label>
                <input className="input mt-2" defaultValue="+91 98xxxxxx12" />
              </div>
              <div className="lg:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Address</label>
                <input className="input mt-2" defaultValue="Pune, Maharashtra" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="btn btn-primary">Save</button>
              <button className="btn btn-ghost">Change password</button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

