import mongoose from 'mongoose';
import crypto from 'crypto';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Hash password with salt
adminSchema.statics.hashPassword = function (password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

// Create a new admin with hashed password
adminSchema.statics.createAdmin = async function (username, password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = this.hashPassword(password, salt);
  return this.create({ username, passwordHash, salt });
};

// Verify password
adminSchema.methods.verifyPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
  return hash === this.passwordHash;
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
