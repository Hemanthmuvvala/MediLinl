const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// GET /api/admin/all — Get all data for admin dashboard
router.get('/all', async (req, res) => {
  try {
    const [doctors, patients, appointments] = await Promise.all([
      Doctor.find({}, '-password'),
      User.find({ role: 'patient' }, '-password'),
      Appointment.find({})
        .populate('patientId', 'name email phone')
        .populate('doctorId', 'name specialty')
        .sort({ createdAt: -1 }),
    ]);
    res.json({ doctors, patients, appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/doctors — Add a new doctor
router.post('/doctors', async (req, res) => {
  try {
    const { name, specialty, experience, consultationFee, email, password, phone } = req.body;
    if (!name || !specialty || !experience || !consultationFee || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' });

    const existing = await Doctor.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Doctor email already exists.' });

    const doctor = await Doctor.create({ name, specialty, experience, consultationFee, email, password, phone });
    const { password: _, ...doctorData } = doctor.toObject();
    res.status(201).json({ message: 'Doctor added successfully!', doctor: doctorData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/doctors/:id — Remove a doctor
router.delete('/doctors/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor removed successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
