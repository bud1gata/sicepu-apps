// Seed script to create default admin user
// Run with: node server/seed-admin.js

import dotenv from 'dotenv';
import connectDB from './db.js';
import Admin from './models/admin.js';

dotenv.config();

async function seed() {
  await connectDB();

  const existing = await Admin.findOne({ username: 'admin' });
  if (existing) {
    console.log('Admin user already exists. Skipping seed.');
    process.exit(0);
  }

  await Admin.createAdmin('admin', 'admin123');
  console.log('✅ Default admin created:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('   (Please change this password after first login!)');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
