import { useEffect, useMemo, useState } from "react";
import { Brain, Calendar, Sparkles, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../feedback/Modal";
import { useToast } from "../feedback/ToastContext";
import { PageShell } from "../components/PageShell";
import { DoctorCard } from "../components/booking/DoctorCard";
import { GlassCard, GlassCardBody, GlassCardHeader } from "../components/dashboard/GlassCard";
import { mockDoctors } from "../mock/data";
import { recommendDoctors } from "../lib/recommendations";
import { bookAppointment, listDoctors, predictWaitTime } from "../lib/api";

export default function BookAppointment() {
  const nav = useNavigate();
  const toast = useToast();
  const [aiOpen, setAiOpen] = useState(false);
  const [complaint, setComplaint] = useState("");
  const [preferredDept, setPreferredDept] = useState("");
  const [slotStartAt, setSlotStartAt] = useState(() => new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16));
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [doctors, setDoctors] = useState(null);
  const [mlById, setMlById] = useState({});
  const [mlLoading, setMlLoading] = useState(false);
  const [bookState, setBookState] = useState({ busy: false, msg: "", err: "" });

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const list = await listDoctors();
        if (!cancel) setDoctors(list.length ? list : mockDoctors);
      } catch {
        if (!cancel) setDoctors(mockDoctors);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!doctors?.length) return undefined;
    let cancel = false;
    (async () => {
      setMlLoading(true);
      const ts = new Date().toISOString();
      const next = {};
      await Promise.all(
        doctors.map(async (d, i) => {
          try {
            const qLen = 12 + ((i * 3) % 25);
            const arrivals = 6 + ((i * 2) % 8);
            const serviceRate = d.serviceRate ?? Math.min(200, Math.max(1, Math.round(60 / (d.avgServiceMinutes || 10))));
            const pred = await predictWaitTime({
              department: d.department,
              timestamp: ts,
              queue_len: qLen,
              arrivals_30m: arrivals,
              service_rate: serviceRate,
              emergency_share: d.isEmergencyCapable ? 0.08 : 0.03,
            });
            next[d.id] = pred;
          } catch {
            /* ML or API offline — omit */
          }
        })
      );
      if (!cancel) {
        setMlById(next);
        setMlLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [doctors]);

  const rec = useMemo(() => {
    if (!doctors) return { inferredDept: null, recommendedDoctorId: null, ranked: [] };
    return recommendDoctors({
      doctors,
      complaint,
      preferredDept: preferredDept || null,
      mlWaitById: mlById,
    });
  }, [doctors, complaint, preferredDept, mlById]);

  const doctorsToShow = rec.ranked;
  const recommendedId = rec.recommendedDoctorId;

  async function onBook() {
    if (!selectedDoctorId) {
      setBookState({ busy: false, msg: "", err: "Please select a doctor first." });
      return;
    }
    const start = new Date(slotStartAt);
    if (Number.isNaN(start.getTime())) {
      setBookState({ busy: false, msg: "", err: "Please choose a valid slot date/time." });
      return;
    }
    setBookState({ busy: true, msg: "", err: "" });
    try {
      const result = await bookAppointment({
        doctorId: selectedDoctorId,
        slotStartAt: start.toISOString(),
        slotEndAt: new Date(start.getTime() + 30 * 60 * 1000).toISOString(),
        reason: complaint || "General consultation",
        priorityLevel: "NORMAL",
      });
      setBookState({ busy: false, msg: "Appointment booked successfully.", err: "" });
      toast.success("Appointment confirmed. Redirecting to your live queue…");
      nav(`/queue?doctorId=${encodeURIComponent(result.doctorId)}&slotStartAt=${encodeURIComponent(result.slotStartAt)}`);
    } catch (e) {
      setBookState({ busy: false, msg: "", err: e.message || "Booking failed" });
    }
  }

  return (
    <PageShell
      title="Book Appointment"
      subtitle="AI-assisted doctor matching with live wait-time predictions."
      actions={
        <button type="button" className="btn btn-primary" onClick={onBook} disabled={bookState.busy}>
          <Calendar className="h-4 w-4" />
          {bookState.busy ? "Booking…" : "Book"}
        </button>
      }
    >
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-32 top-24 h-72 w-72 rounded-full bg-brand-400/10 blur-3xl" />
        <div className="absolute -left-24 bottom-32 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl" />
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2">
          <GlassCard delay={0}>
            <GlassCardHeader>
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <Brain className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  Smart intake
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Symptom-aware routing with real-time queue intelligence.
                </div>
              </div>
              <button type="button" className="badge badge-blue transition hover:shadow-sm" onClick={() => setAiOpen(true)}>
                <Stethoscope className="h-3.5 w-3.5" />
                AI assist
              </button>
            </GlassCardHeader>
            <GlassCardBody className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">What are you experiencing?</label>
                <textarea
                  className="input-modern mt-2 min-h-[100px] resize-y"
                  placeholder="e.g., fever and cough since 2 days, breathing difficulty…"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Preferred department (optional)</label>
                <select className="select mt-2" value={preferredDept} onChange={(e) => setPreferredDept(e.target.value)}>
                  <option value="">Auto-detect</option>
                  <option>General Medicine</option>
                  <option>Cardiology</option>
                  <option>Pulmonology</option>
                  <option>Dermatology</option>
                  <option>Pediatrics</option>
                  <option>Orthopedics</option>
                </select>
                <div className="mt-2 rounded-xl border border-brand-200/50 bg-brand-50/50 px-3 py-2 text-xs dark:border-brand-900/50 dark:bg-brand-950/30">
                  Detected department:{" "}
                  <span className="font-semibold text-brand-800 dark:text-brand-200">{rec.inferredDept || "—"}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Slot start</label>
                <input
                  type="datetime-local"
                  className="input-modern mt-2"
                  value={slotStartAt}
                  onChange={(e) => setSlotStartAt(e.target.value)}
                />
              </div>
            </GlassCardBody>
          </GlassCard>

          <GlassCard delay={0.06}>
            <GlassCardHeader>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Selection</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Recommended doctor is highlighted.</div>
              </div>
              <span className={mlLoading ? "badge badge-amber" : "badge badge-green"}>
                {doctors == null ? "Loading doctors…" : mlLoading ? "ML predicting…" : "ML ready"}
              </span>
            </GlassCardHeader>
            <GlassCardBody>
              <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50/80 to-white/60 p-4 text-sm text-slate-700 dark:border-slate-800/70 dark:from-slate-900/50 dark:to-slate-900/30 dark:text-slate-300">
                {selectedDoctorId ? (
                  <>
                    Selected:{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {doctors?.find((d) => d.id === selectedDoctorId)?.name}
                    </span>
                  </>
                ) : (
                  <>
                    Tip: select the <span className="font-semibold text-brand-700 dark:text-brand-300">AI pick</span> doctor for the shortest predicted wait.
                  </>
                )}
              </div>
              {bookState.msg ? (
                <div className="mt-3 rounded-xl border border-emerald-200/60 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                  {bookState.msg}
                </div>
              ) : null}
              {bookState.err ? (
                <div className="mt-3 rounded-xl border border-rose-200/60 bg-rose-50/80 px-3 py-2 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200">
                  {bookState.err}
                </div>
              ) : null}
            </GlassCardBody>
          </GlassCard>
        </div>

        <GlassCard className="lg:col-span-3" delay={0.04}>
          <GlassCardHeader>
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Doctors</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Sorted by symptom match + ML wait estimate</div>
              </div>
              {recommendedId ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-600/10 to-violet-600/10 px-3 py-1 text-xs font-semibold text-brand-800 ring-1 ring-brand-200/60 dark:text-brand-200 dark:ring-brand-800/50">
                  <Sparkles className="h-3.5 w-3.5" />
                  Recommendation ready
                </span>
              ) : (
                <span className="badge">Start typing symptoms</span>
              )}
            </div>
          </GlassCardHeader>
          <GlassCardBody className="grid gap-3">
            {doctors == null ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                ))}
              </div>
            ) : (
              doctorsToShow.map((d, index) => (
                <DoctorCard
                  key={d.id}
                  d={d}
                  rankIndex={index}
                  selected={selectedDoctorId === d.id}
                  isRecommended={recommendedId === d.id}
                  onSelect={(id) => setSelectedDoctorId(id)}
                  ml={mlById[d.id]}
                />
              ))
            )}
          </GlassCardBody>
        </GlassCard>
      </div>

      <Modal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        title="AI-assisted matching"
        description="How we rank doctors for your visit"
        footer={
          <button type="button" className="btn btn-primary" onClick={() => setAiOpen(false)}>
            Got it
          </button>
        }
      >
        <ul className="list-inside list-disc space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>Symptoms and department preference infer the best clinical fit.</li>
          <li>Predicted wait times refresh from live queue models.</li>
          <li>The highlighted doctor balances match confidence and shortest wait.</li>
        </ul>
      </Modal>
    </PageShell>
  );
}
