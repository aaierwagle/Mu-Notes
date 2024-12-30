import mongoose from 'mongoose';

// Define Favorite Schema
const favoriteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // User's email
  },
  noteId: {
    type: String,
    ref: 'Note',
  },
  assignmentId: {
    type: String,
    ref: 'Assignment',
  },
});

// Add custom validation to ensure one of `noteId` or `assignmentId` is required
favoriteSchema.pre('validate', function (next) {
  if (!this.noteId && !this.assignmentId) {
    next(new Error('Either noteId or assignmentId is required.'));
  } else if (this.noteId && this.assignmentId) {
    next(new Error('Only one of noteId or assignmentId should be present.'));
  } else {
    next();
  }
});

// Create Favorite model (if it doesn't exist)
export const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);
