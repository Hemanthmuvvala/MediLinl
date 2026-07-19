/**
 * seedAdmin.js
 * Run once to create an admin account:
 *   node seedAdmin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@bookadoctor.com' });
  if (existing) {
    console.log('ℹ️  Admin already exists:', existing.email);
  } else {
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@bookadoctor.com',
      password: 'admin123',
      phone: '9999999999',
      role: 'admin',
    });
    console.log('✅ Admin created:', admin.email, '/ Password: admin123');
  }

  await mongoose.disconnect();
  console.log('👋 Done!');
}

seed().catch((err) => { console.error(err); process.exit(1); });
