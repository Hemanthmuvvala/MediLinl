const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true },
    experience: { type: Number, required: true },
    consultationFee: { type: Number, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
