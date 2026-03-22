import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export { }; // Mark as module to avoid global scope clashing

const MONGODB_URI = 'mongodb://localhost:27017/SparkTech';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // We redefined a minimal schema just for seeding
  const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String },
    name: String,
    role: String
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  const email = 'admin@sparktech.com';
  const password = 'admin12345';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`User ${email} already exists. Updating to superadmin...`);
    existing.role = 'superadmin';
    await existing.save();
    console.log('Role updated successfully.');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await User.create({
    email,
    password: hashedPassword,
    name: 'Super Admin',
    role: 'superadmin'
  });

  console.log(`Super Admin (${email}) created successfully with password: ${password}`);
  console.log(`Super Admin (${email}) created successfully with password: ${password}`);
}

seed()
  .then(() => {
    console.log('Seed completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
