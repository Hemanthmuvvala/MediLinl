const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// GET /api/doctors — List all available doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({}, '-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctors/:id — Get a single doctor
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id, '-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
