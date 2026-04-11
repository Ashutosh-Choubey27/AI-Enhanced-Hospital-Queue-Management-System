const { bookAppointment, checkInAppointment } = require("../services/appointmentService");

async function bookAppointmentController(req, res, next) {
  try {
    const { doctorId, slotStartAt, slotEndAt, reason, priorityLevel, priorityScore, patientId } =
      req.validated.body;
    const authUserId = req.auth.sub;

    const appt = await bookAppointment({
      patientId: patientId || authUserId,
      doctorId,
      slotStartAt: new Date(slotStartAt),
      slotEndAt: new Date(slotEndAt),
      reason,
      priorityLevel,
      priorityScore,
      createdByUserId: authUserId,
    });

    return res.status(201).json({ ok: true, data: appt });
  } catch (e) {
    return next(e);
  }
}

async function checkInController(req, res, next) {
  try {
    const { appointmentId } = req.validated.body;
    const result = await checkInAppointment({ appointmentId, actorUserId: req.auth.sub });
    return res.json({ ok: true, data: result });
  } catch (e) {
    return next(e);
  }
}

module.exports = { bookAppointmentController, checkInController };
