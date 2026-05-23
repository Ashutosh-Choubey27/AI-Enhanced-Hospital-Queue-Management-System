import { motion as Motion } from "framer-motion";
import { CalendarPlus, Calendar, History } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { AppointmentCard } from "../components/appointments/AppointmentCard";
import { GlassCard, GlassCardBody, GlassCardHeader } from "../components/dashboard/GlassCard";
import { EmptyState } from "../components/ui/EmptyState";
import { useToast } from "../feedback/ToastContext";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkInAppointment, listMyAppointments } from "../lib/api";

export default function AppointmentsPage() {
  const nav = useNavigate();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listMyAppointments();
        if (mounted) setItems(data);
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const [upcoming, history] = useMemo(() => {
    const now = Date.now();
    const up = items.filter(
      (a) => new Date(a.slotStartAt).getTime() >= now && !["COMPLETED", "CANCELLED", "NO_SHOW"].includes(a.status)
    );
    const hi = items.filter((a) => !up.includes(a));
    return [up, hi];
  }, [items]);

  function goQueue(a) {
    nav(`/queue?doctorId=${encodeURIComponent(a.doctorId)}&slotStartAt=${encodeURIComponent(a.slotStartAt)}`);
  }

  async function onCheckIn(a) {
    try {
      await checkInAppointment(a.id);
      const refreshed = await listMyAppointments();
      setItems(refreshed);
      toast.success("Checked in successfully. Opening your queue…");
      goQueue(a);
    } catch (e) {
      toast.error(e.message || "Check-in failed. Please try again at reception.");
    }
  }

  return (
    <PageShell
      title="Appointments"
      subtitle="Upcoming visits and consultation history."
      actions={
        <button type="button" className="btn btn-primary" onClick={() => nav("/book")}>
          <CalendarPlus className="h-4 w-4" />
          Book new
        </button>
      }
    >
      <Motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 grid gap-3 sm:grid-cols-3"
      >
        {[
          { label: "Upcoming", value: upcoming.length, tone: "text-brand-700 dark:text-brand-300" },
          { label: "History", value: history.length, tone: "text-slate-700 dark:text-slate-300" },
          { label: "Total", value: items.length, tone: "text-emerald-700 dark:text-emerald-300" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/50"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{s.label}</div>
            <div className={`mt-1 text-2xl font-bold tabular-nums ${s.tone}`}>{loading ? "—" : s.value}</div>
          </div>
        ))}
      </Motion.div>

      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard delay={0}>
          <GlassCardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Upcoming</div>
                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Next visits · timeline view</div>
              </div>
            </div>
            <span className="badge badge-blue">{upcoming.length} scheduled</span>
          </GlassCardHeader>
          <GlassCardBody className="space-y-1">
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                ))}
              </div>
            ) : null}
            {!loading &&
              upcoming.map((a, i) => (
                <AppointmentCard key={a.id} appointment={a} index={i} variant="upcoming" onJoinQueue={goQueue} onCheckIn={onCheckIn} />
              ))}
            {!loading && upcoming.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="You're all set"
                hint="No upcoming consultations scheduled. Book a visit when you're ready."
                action={
                  <button type="button" className="btn btn-primary text-xs" onClick={() => nav("/book")}>
                    Book appointment
                  </button>
                }
              />
            ) : null}
          </GlassCardBody>
        </GlassCard>

        <GlassCard delay={0.06}>
          <GlassCardHeader>
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">History</div>
                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Past consultations</div>
              </div>
            </div>
            <span className="badge">{history.length} records</span>
          </GlassCardHeader>
          <GlassCardBody className="space-y-1">
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                ))}
              </div>
            ) : null}
            {!loading &&
              history.map((a, i) => (
                <AppointmentCard key={a.id} appointment={a} index={i} variant="history" onJoinQueue={goQueue} onCheckIn={onCheckIn} />
              ))}
            {!loading && history.length === 0 ? (
              <EmptyState
                icon={History}
                title="No visit history yet"
                hint="Completed consultations will appear here with status and timeline details."
              />
            ) : null}
          </GlassCardBody>
        </GlassCard>
      </div>
    </PageShell>
  );
}
