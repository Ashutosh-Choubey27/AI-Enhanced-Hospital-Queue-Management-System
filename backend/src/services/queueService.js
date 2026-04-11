const Queue = require("../models/Queue");
const QueueLog = require("../models/QueueLog");
const Appointment = require("../models/Appointment");
const { QUEUE_ENTRY_STATUS, APPOINTMENT_STATUS } = require("../lib/constants");
const { emitQueueUpdated } = require("../socket");

function pickNextEntry(entries) {
  // Only WAITING entries are eligible for "next". Others are effectively skipped.
  const candidates = entries.filter((e) => e.status === QUEUE_ENTRY_STATUS.WAITING);
  candidates.sort((a, b) => {
    if ((b.priorityScore || 0) !== (a.priorityScore || 0)) return (b.priorityScore || 0) - (a.priorityScore || 0);
    return (a.position || 0) - (b.position || 0);
  });
  return candidates[0] || null;
}

async function getQueue({ doctorId, slotStartAt }) {
  const queue = await Queue.findOne({ doctorId, slotStartAt });
  if (!queue) {
    const err = new Error("Queue not found");
    err.statusCode = 404;
    throw err;
  }
  return queue;
}

async function callNext({ doctorId, slotStartAt, actorUserId }) {
  const queue = await Queue.findOne({ doctorId, slotStartAt });
  if (!queue) {
    const err = new Error("Queue not found");
    err.statusCode = 404;
    throw err;
  }

  const nextEntry = pickNextEntry(queue.entries);
  if (!nextEntry) return { queue, entry: null };

  nextEntry.status = QUEUE_ENTRY_STATUS.CALLED;
  nextEntry.calledAt = new Date();
  queue.currentTokenNo = nextEntry.tokenNo;
  queue.lastCalledEntryId = nextEntry._id;
  queue.lastUpdatedByUserId = actorUserId;
  await queue.save();

  const appt = await Appointment.findById(nextEntry.appointmentId);
  if (appt) {
    appt.status = APPOINTMENT_STATUS.CALLED;
    await appt.save();
  }

  await QueueLog.create({
    queueId: queue._id,
    doctorId: queue.doctorId,
    appointmentId: nextEntry.appointmentId,
    queueEntryId: nextEntry._id,
    patientId: nextEntry.patientId,
    eventType: "CALL_NEXT",
    fromStatus: QUEUE_ENTRY_STATUS.WAITING,
    toStatus: QUEUE_ENTRY_STATUS.CALLED,
    actorUserId,
    meta: { tokenNo: nextEntry.tokenNo },
  });

  emitQueueUpdated({ doctorId: queue.doctorId, slotStartAt: queue.slotStartAt, queue });
  return { queue, entry: nextEntry };
}

async function markNoShow({ doctorId, slotStartAt, queueEntryId, actorUserId }) {
  const queue = await Queue.findOne({ doctorId, slotStartAt });
  if (!queue) {
    const err = new Error("Queue not found");
    err.statusCode = 404;
    throw err;
  }
  const entry = queue.entries.id(queueEntryId);
  if (!entry) {
    const err = new Error("Queue entry not found");
    err.statusCode = 404;
    throw err;
  }

  const fromStatus = entry.status;
  entry.status = QUEUE_ENTRY_STATUS.NO_SHOW;
  queue.lastUpdatedByUserId = actorUserId;
  await queue.save();

  const appt = await Appointment.findById(entry.appointmentId);
  if (appt) {
    appt.status = APPOINTMENT_STATUS.NO_SHOW;
    await appt.save();
  }

  await QueueLog.create({
    queueId: queue._id,
    doctorId: queue.doctorId,
    appointmentId: entry.appointmentId,
    queueEntryId: entry._id,
    patientId: entry.patientId,
    eventType: "MARK_NO_SHOW",
    fromStatus,
    toStatus: QUEUE_ENTRY_STATUS.NO_SHOW,
    actorUserId,
    meta: { tokenNo: entry.tokenNo },
  });

  emitQueueUpdated({ doctorId: queue.doctorId, slotStartAt: queue.slotStartAt, queue });
  return { queue, entry };
}

async function skipEntry({ doctorId, slotStartAt, queueEntryId, actorUserId, reason }) {
  const queue = await Queue.findOne({ doctorId, slotStartAt });
  if (!queue) {
    const err = new Error("Queue not found");
    err.statusCode = 404;
    throw err;
  }
  const entry = queue.entries.id(queueEntryId);
  if (!entry) {
    const err = new Error("Queue entry not found");
    err.statusCode = 404;
    throw err;
  }

  const fromStatus = entry.status;
  entry.status = QUEUE_ENTRY_STATUS.SKIPPED;
  queue.lastUpdatedByUserId = actorUserId;
  await queue.save();

  await QueueLog.create({
    queueId: queue._id,
    doctorId: queue.doctorId,
    appointmentId: entry.appointmentId,
    queueEntryId: entry._id,
    patientId: entry.patientId,
    eventType: "SKIP_ENTRY",
    fromStatus,
    toStatus: QUEUE_ENTRY_STATUS.SKIPPED,
    actorUserId,
    message: reason,
    meta: { tokenNo: entry.tokenNo },
  });

  emitQueueUpdated({ doctorId: queue.doctorId, slotStartAt: queue.slotStartAt, queue });
  return { queue, entry };
}

module.exports = { getQueue, callNext, markNoShow, skipEntry };
