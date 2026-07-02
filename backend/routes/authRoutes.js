const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// POST /api/auth/register — Register a new patient
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required.' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered.' });

    const user = await User.create({ name, email, password, phone, role: 'patient' });
    const { password: _, ...userData } = user.toObject();
    res.status(201).json({ message: 'Registered successfully!', user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login — Login for patients and admins
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const { password: _, ...userData } = user.toObject();
    res.json({ message: 'Login successful!', user: { ...userData, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/doctor-login — Login for doctors
router.post('/doctor-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email, password });
    if (!doctor) return res.status(401).json({ message: 'Invalid email or password.' });

    const { password: _, ...doctorData } = doctor.toObject();
    res.json({ message: 'Login successful!', user: { ...doctorData, role: 'doctor' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
