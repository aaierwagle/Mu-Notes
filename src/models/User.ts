import mongoose from 'mongoose'

// Define User Schema
const userSchema = new mongoose.Schema({
  name: String,
  semester: String,
  email: { type: String, unique: true },
  password: String,
  provider: String,
  lastLogin: Date,
  image: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Default role: user, also admin
  isVerifiedByAdmin: { type: Boolean, default: false }, // Admin verification field
});

// Create User model (if it doesn't exist)
export const User = mongoose.models.User || mongoose.model('User', userSchema);
