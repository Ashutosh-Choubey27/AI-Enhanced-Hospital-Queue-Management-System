import { useMemo, useState } from "react";
import { Sparkles, Stethoscope } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { cn } from "../lib/cn";
import { mockDoctors } from "../mock/data";
import { recommendDoctors } from "../lib/recommendations";

function DoctorCard({ d, isRecommended, onSelect, selected }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(d.id)}
      className={cn(
        "w-full text-left rounded-2xl border p-4 transition",
        selected ? "border-brand-300 bg-brand-50" : "border-slate-200 bg-white hover:bg-slate-50",
        isRecommended ? "ring-4 ring-brand-100" : ""
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-bold text-slate-900">{d.name}</div>
            {isRecommended ? (
              <span className="badge badge-blue">
                <Sparkles className="h-3.5 w-3.5" />
                Recommended
              </span>
            ) : null}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {d.department} • {d.specialization}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="badge">⭐ {d.rating}</span>
            <span className={cn("badge", d.predictedWaitMins <= 20 ? "badge-green" : "badge-amber")}>
              ⏳ {d.predictedWaitMins} min wait
            </span>
            {d.isEmergencyCapable ? <span className="badge badge-red">Emergency ready</span> : <span className="badge">Standard</span>}
          </div>
        </div>
        <div className="badge">{d.nextSlotLabel}</div>
      </div>
    </button>
  );
}

export default function BookAppointment() {
  const [complaint, setComplaint] = useState("");
  const [preferredDept, setPreferredDept] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const rec = useMemo(() => {
    return recommendDoctors({
      doctors: mockDoctors,
      complaint,
      preferredDept: preferredDept || null,
    });
  }, [complaint, preferredDept]);

  const doctorsToShow = rec.ranked;
  const recommendedId = rec.recommendedDoctorId;

  return (
    <PageShell
      title="Book Appointment"
      subtitle="Tell us what you need—AI will recommend the best doctor + shortest queue."
      actions={<button className="btn btn-primary">Book</button>}
    >
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="text-sm font-semibold text-slate-900">Smart intake</div>
                <div className="mt-1 text-xs text-slate-500">We use symptoms + predicted wait time to recommend.</div>
              </div>
              <span className="badge badge-blue">
                <Stethoscope className="h-3.5 w-3.5" />
                AI assist
              </span>
            </div>
            <div className="card-body space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">What are you experiencing?</label>
                <textarea
                  className="input mt-2 min-h-[90px]"
                  placeholder="e.g., fever and cough since 2 days, breathing difficulty…"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Preferred department (optional)</label>
                <select className="select mt-2" value={preferredDept} onChange={(e) => setPreferredDept(e.target.value)}>
                  <option value="">Auto-detect</option>
                  <option>General Medicine</option>
                  <option>Cardiology</option>
                  <option>Pulmonology</option>
                  <option>Dermatology</option>
                  <option>Pediatrics</option>
                  <option>Orthopedics</option>
                </select>
                <div className="mt-2 text-xs text-slate-500">
                  Detected:{" "}
                  <span className="font-semibold text-slate-800">{rec.inferredDept || "—"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="text-sm font-semibold text-slate-900">Selection</div>
                <div className="mt-1 text-xs text-slate-500">Recommended doctor is highlighted.</div>
              </div>
              <span className="badge badge-amber">Prototype data</span>
            </div>
            <div className="card-body">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                {selectedDoctorId ? (
                  <>
                    Selected:{" "}
                    <span className="font-semibold text-slate-900">
                      {mockDoctors.find((d) => d.id === selectedDoctorId)?.name}
                    </span>
                  </>
                ) : (
                  <>
                    Tip: click the{" "}
                    <span className="font-semibold text-slate-900">Recommended</span> doctor first for best wait time.
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="text-sm font-semibold text-slate-900">Doctors</div>
                <div className="mt-1 text-xs text-slate-500">Sorted by match + predicted wait time</div>
              </div>
              {recommendedId ? (
                <span className="badge badge-blue">
                  <Sparkles className="h-3.5 w-3.5" />
                  Recommendation ready
                </span>
              ) : (
                <span className="badge">Start typing symptoms</span>
              )}
            </div>
            <div className="card-body grid gap-3">
              {doctorsToShow.map((d) => (
                <DoctorCard
                  key={d.id}
                  d={d}
                  selected={selectedDoctorId === d.id}
                  isRecommended={recommendedId === d.id}
                  onSelect={(id) => setSelectedDoctorId(id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

