const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// POST /api/appointments — Create a new appointment
router.post('/', async (req, res) => {
  try {
    const { patientId, doctorId, date, time, notes } = req.body;
    if (!patientId || !doctorId || !date || !time)
      return res.status(400).json({ message: 'patientId, doctorId, date and time are required.' });

    const appointment = await Appointment.create({ patientId, doctorId, date, time, notes });
    const populated = await appointment.populate([
      { path: 'patientId', select: 'name email' },
      { path: 'doctorId', select: 'name specialty' },
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments/patient/:patientId — Get all appointments for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name specialty consultationFee')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments/doctor/:doctorId — Get all appointments for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId })
      .populate('patientId', 'name email phone')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/appointments/:id/status — Update appointment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status))
      return res.status(400).json({ message: 'Invalid status value.' });

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate([
      { path: 'patientId', select: 'name email phone' },
      { path: 'doctorId', select: 'name specialty' },
    ]);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/appointments/:id — Cancel/delete an appointment (patient action)
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
    res.json({ message: 'Appointment deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
