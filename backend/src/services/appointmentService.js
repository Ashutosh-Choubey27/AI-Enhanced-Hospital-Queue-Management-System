const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Queue = require("../models/Queue");
const QueueLog = require("../models/QueueLog");
const { APPOINTMENT_STATUS, QUEUE_ENTRY_STATUS } = require("../lib/constants");
const { computePriorityScore } = require("../lib/priority");
const { emitQueueUpdated } = require("../socket");

async function bookAppointment({
  patientId,
  doctorId,
  slotStartAt,
  slotEndAt,
  reason,
  priorityLevel,
  priorityScore,
  createdByUserId,
}) {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor || !doctor.isActive) {
    const err = new Error("Doctor not available");
    err.statusCode = 400;
    throw err;
  }

  const appt = await Appointment.create({
    patientId,
    doctorId,
    slotStartAt,
    slotEndAt,
    reason,
    priorityLevel,
    priorityScore:
      typeof priorityScore === "number"
        ? priorityScore
        : computePriorityScore({ priorityLevel }),
    status: APPOINTMENT_STATUS.BOOKED,
    createdByUserId,
  });

  return appt;
}

async function checkInAppointment({ appointmentId, actorUserId }) {
  const appt = await Appointment.findById(appointmentId);
  if (!appt) {
    const err = new Error("Appointment not found");
    err.statusCode = 404;
    throw err;
  }
  if ([APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.COMPLETED].includes(appt.status)) {
    const err = new Error("Appointment cannot be checked-in");
    err.statusCode = 400;
    throw err;
  }

  // Idempotent check-in: if already queued, return current state
  if (appt.queueId && appt.queueEntryId && appt.status === APPOINTMENT_STATUS.IN_QUEUE) {
    const existingQueue = await Queue.findById(appt.queueId);
    return { appointment: appt, queue: existingQueue };
  }

  appt.status = APPOINTMENT_STATUS.CHECKED_IN;
  appt.checkedInAt = new Date();
  await appt.save();

  // Ensure queue exists for doctor+slot
  const queue = await Queue.findOneAndUpdate(
    { doctorId: appt.doctorId, slotStartAt: appt.slotStartAt },
    {
      $setOnInsert: {
        doctorId: appt.doctorId,
        slotStartAt: appt.slotStartAt,
        slotEndAt: appt.slotEndAt,
      },
    },
    { new: true, upsert: true }
  );

  const nextToken = queue.nextTokenNo || 1;
  const position = queue.entries.length + 1;

  const entry = {
    appointmentId: appt._id,
    patientId: appt.patientId,
    slotStartAt: appt.slotStartAt,
    slotEndAt: appt.slotEndAt,
    priorityLevel: appt.priorityLevel,
    priorityScore:
      typeof appt.priorityScore === "number"
        ? appt.priorityScore
        : computePriorityScore({ priorityLevel: appt.priorityLevel }),
    status: QUEUE_ENTRY_STATUS.WAITING,
    tokenNo: nextToken,
    position,
  };

  queue.entries.push(entry);
  queue.nextTokenNo = nextToken + 1;
  queue.lastUpdatedByUserId = actorUserId;
  await queue.save();

  const entryId = queue.entries[queue.entries.length - 1]._id;
  appt.queueId = queue._id;
  appt.queueEntryId = entryId;
  appt.status = APPOINTMENT_STATUS.IN_QUEUE;
  if (typeof appt.priorityScore !== "number") {
    appt.priorityScore = entry.priorityScore;
  }
  await appt.save();

  await QueueLog.create({
    queueId: queue._id,
    doctorId: queue.doctorId,
    appointmentId: appt._id,
    queueEntryId: entryId,
    patientId: appt.patientId,
    eventType: "CHECK_IN",
    fromStatus: APPOINTMENT_STATUS.CHECKED_IN,
    toStatus: APPOINTMENT_STATUS.IN_QUEUE,
    actorUserId,
    meta: { tokenNo: nextToken, position },
  });

  emitQueueUpdated({ doctorId: queue.doctorId, slotStartAt: queue.slotStartAt, queue });
  return { appointment: appt, queue };
}

module.exports = { bookAppointment, checkInAppointment };
