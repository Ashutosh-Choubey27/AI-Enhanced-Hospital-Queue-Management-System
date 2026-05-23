import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link2, Radio } from "lucide-react";
import { useToast } from "../feedback/ToastContext";
import { PageShell } from "../components/PageShell";
import { QueueViz } from "../components/QueueViz";
import { GlassCard, GlassCardBody, GlassCardHeader } from "../components/dashboard/GlassCard";
import { LiveIndicator } from "../components/dashboard/LiveIndicator";
import { mockQueue } from "../mock/data";
import { useQueueLive } from "../hooks/useQueueLive";
import { useAuth } from "../auth/AuthContext";
import { callNext, markNoShow, skipQueueEntry } from "../lib/api";

export default function QueuePage() {
  const toast = useToast();
  const [sp, setSp] = useSearchParams();
  const doctorIdParam = sp.get("doctorId") || "";
  const slotParam = sp.get("slotStartAt") || "";

  const [draftDoc, setDraftDoc] = useState(doctorIdParam);
  const [draftSlot, setDraftSlot] = useState(() => {
    if (slotParam) {
      try {
        const d = new Date(slotParam);
        if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 16);
      } catch {
        /* ignore */
      }
    }
    return new Date().toISOString().slice(0, 16);
  });

  const liveKey = useMemo(() => {
    if (!doctorIdParam || !slotParam) return null;
    const d = new Date(slotParam);
    if (Number.isNaN(d.getTime())) return null;
    return { doctorId: doctorIdParam, slotStartAt: d };
  }, [doctorIdParam, slotParam]);

  const { queue, loading, error, seq } = useQueueLive(
    liveKey ? { doctorId: liveKey.doctorId, slotStartAt: liveKey.slotStartAt } : { doctorId: null, slotStartAt: null }
  );

  function applyLiveParams(e) {
    e.preventDefault();
    const iso = new Date(draftSlot).toISOString();
    const next = new URLSearchParams(sp);
    next.set("doctorId", draftDoc.trim());
    next.set("slotStartAt", iso);
    setSp(next, { replace: true });
    toast.success("Live queue session connected.");
  }

  const q = queue || null;
  const { user } = useAuth();
  const canManageQueue = Boolean(user?.role) && ["DOCTOR", "RECEPTIONIST", "ADMIN"].includes(user.role);
  const isLive = Boolean(liveKey && q);

  async function onCallNext() {
    if (!liveKey) return;
    try {
      await callNext({ doctorId: liveKey.doctorId, slotStartAt: liveKey.slotStartAt });
      toast.success("Next patient called to the counter.");
    } catch (e) {
      toast.error(e.message || "Could not call next patient.");
    }
  }

  async function onNoShow(queueEntryId) {
    if (!liveKey) return;
    try {
      await markNoShow({ doctorId: liveKey.doctorId, slotStartAt: liveKey.slotStartAt, queueEntryId });
      toast.info("Patient marked as no-show.");
    } catch (e) {
      toast.error(e.message || "Could not update queue entry.");
    }
  }

  async function onSkip(queueEntryId) {
    if (!liveKey) return;
    try {
      await skipQueueEntry({
        doctorId: liveKey.doctorId,
        slotStartAt: liveKey.slotStartAt,
        queueEntryId,
        reason: "Skipped by staff",
      });
      toast.success("Queue entry skipped.");
    } catch (e) {
      toast.error(e.message || "Could not skip entry.");
    }
  }

  return (
    <PageShell
      title="Queue"
      subtitle={
        q
          ? `Live · Doctor ${q.doctorId} · ${new Date(q.slotStartAt).toLocaleString()}`
          : liveKey
            ? `Connecting… ${liveKey.doctorId}`
            : `${mockQueue.doctorName} · preview — connect your visit below`
      }
      actions={
        <>
          <LiveIndicator live={isLive && !loading} label={loading ? "Connecting…" : liveKey ? "Live" : "Preview"} />
          {error ? <span className="badge badge-red">API offline</span> : null}
          {canManageQueue && q ? (
            <button type="button" className="btn btn-primary" onClick={onCallNext}>
              <Radio className="h-4 w-4" />
              Call Next
            </button>
          ) : null}
        </>
      }
    >
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute right-1/4 top-20 h-80 w-80 rounded-full bg-emerald-400/8 blur-3xl" />
      </div>

      <GlassCard className="mb-5" delay={0} hover={false}>
        <GlassCardHeader>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <Link2 className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              Connect your visit
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Enter the doctor and slot from your appointment confirmation to stream live queue updates.
            </div>
          </div>
        </GlassCardHeader>
        <GlassCardBody>
          <form onSubmit={applyLiveParams} className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="min-w-[200px] flex-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Doctor reference</label>
              <input
                className="input-modern mt-2 font-mono text-xs"
                value={draftDoc}
                onChange={(e) => setDraftDoc(e.target.value)}
                placeholder="From your appointment confirmation"
              />
            </div>
            <div className="min-w-[200px] flex-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Slot start (local)</label>
              <input type="datetime-local" className="input-modern mt-2" value={draftSlot} onChange={(e) => setDraftSlot(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">
              Load live queue
            </button>
          </form>
        </GlassCardBody>
      </GlassCard>

      {q ? (
        <QueueViz
          isLive
          currentToken={q.currentTokenNo}
          updateSeq={seq}
          entries={(q.entries || []).map((e) => ({
            tokenNo: e.tokenNo,
            name: e.patientName || String(e.patientId),
            status: e.status,
            priority: e.priorityLevel,
            queueEntryId: e._id,
          }))}
          onSkip={canManageQueue ? onSkip : null}
          onNoShow={canManageQueue ? onNoShow : null}
        />
      ) : (
        <QueueViz entries={mockQueue.entries} currentToken={mockQueue.currentToken} updateSeq={0} />
      )}
    </PageShell>
  );
}
