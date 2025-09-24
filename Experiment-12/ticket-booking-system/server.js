const express = require("express");
const app = express();
const PORT = 3000;

// In-memory storage for seat states and locks
const seats = {};
const locks = {};

// Initialize seats (e.g., 10 seats)
const TOTAL_SEATS = 10;
for (let i = 1; i <= TOTAL_SEATS; i++) {
  seats[i] = { status: "available" };  // status: available | locked | booked
}

// Helper: unlock after timeout
function setLockTimeout(seatId, timeoutMs = 60000) {
  if (locks[seatId]?.timeout) clearTimeout(locks[seatId].timeout);
  locks[seatId].timeout = setTimeout(() => {
    if (seats[seatId].status === "locked") {
      seats[seatId].status = "available";
      delete locks[seatId];
    }
  }, timeoutMs);
}

// Get all seats
app.get("/seats", (req, res) => {
  res.json(seats);
});

// Lock a seat
app.post("/lock/:id", (req, res) => {
  const seatId = req.params.id;
  if (!seats[seatId]) return res.status(404).json({ message: "Seat not found" });
  if (seats[seatId].status === "booked") return res.status(400).json({ message: "Seat already booked" });
  if (seats[seatId].status === "locked") return res.status(400).json({ message: "Seat already locked" });

  seats[seatId].status = "locked";
  locks[seatId] = { lockedAt: Date.now() };
  setLockTimeout(seatId);

  res.json({ message: `Seat ${seatId} locked successfully. Confirm within 1 minute.` });
});

// Confirm booking
app.post("/confirm/:id", (req, res) => {
  const seatId = req.params.id;
  if (!seats[seatId]) return res.status(404).json({ message: "Seat not found" });
  if (seats[seatId].status !== "locked") {
    return res.status(400).json({ message: "Seat is not locked and cannot be booked" });
  }

  seats[seatId].status = "booked";
  if (locks[seatId]) {
    clearTimeout(locks[seatId].timeout);
    delete locks[seatId];
  }
  res.json({ message: `Seat ${seatId} booked successfully!` });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
