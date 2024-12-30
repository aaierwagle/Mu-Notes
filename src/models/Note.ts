// schemas/Note.js
import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  chapter: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  publicId: {  // Added for Cloudinary
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
