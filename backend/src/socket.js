let ioRef = null;

function initSocket(io) {
  ioRef = io;
  return ioRef;
}

function getIo() {
  return ioRef;
}

function emitQueueUpdated({ doctorId, slotStartAt, queue }) {
  if (!ioRef) return;
  const key = typeof slotStartAt === "string" ? slotStartAt : new Date(slotStartAt).toISOString();
  ioRef.to(`queue:${doctorId}:${key}`).emit("queue:updated", {
    doctorId: String(doctorId),
    slotStartAt: key,
    queue,
  });
}

module.exports = { initSocket, getIo, emitQueueUpdated };

