import { PageShell } from "../components/PageShell";
import { QueueViz } from "../components/QueueViz";
import { mockQueue } from "../mock/data";
import { useQueueLive } from "../hooks/useQueueLive";

export default function QueuePage() {
  // Demo defaults: replace with selected doctor+slot from your app state later.
  const doctorId = "demo-doctor-id";
  const slotStartAt = new Date(); // current slot key in ISO; will need to match backend queue slotStartAt

  const { queue, loading, error } = useQueueLive({ doctorId, slotStartAt });
  const q = queue || null;

  return (
    <PageShell
      title="Queue"
      subtitle={
        q
          ? `Doctor: ${q.doctorId} • Slot: ${new Date(q.slotStartAt).toLocaleString()}`
          : `${mockQueue.doctorName} • ${mockQueue.department} • ${mockQueue.slotLabel}`
      }
      actions={
        <>
          <span className="badge">{loading ? "Connecting…" : "Live"}</span>
          {error ? <span className="badge badge-red">Offline</span> : null}
        </>
      }
    >
      {q ? (
        <QueueViz
          currentToken={q.currentTokenNo}
          entries={(q.entries || []).map((e) => ({
            tokenNo: e.tokenNo,
            name: String(e.patientId),
            status: e.status,
            priority: e.priorityLevel,
          }))}
        />
      ) : (
        <QueueViz entries={mockQueue.entries} currentToken={mockQueue.currentToken} />
      )}
    </PageShell>
  );
}

