import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema(
  {
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
      type: String,  // Using String for semesters, as "1st Semester" is a string
      required: true,
    },
    chapters: {
      type: [String],  // Array of chapter names for the subject
      required: true,
    },
    dueDate: {
      type: Date,
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Assignment ||
  mongoose.model('Assignment', AssignmentSchema);
