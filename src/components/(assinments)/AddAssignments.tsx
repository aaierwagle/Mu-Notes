"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { SemestersData } from "@/constant/SemesterData";

// Define types for Subject and Chapter
interface Chapter {
  name: string;
}

interface Subject {
  name: string;
  chapters: Chapter[];
}

const AddAssignments = () => {
  // Use the correct types instead of `any[]`
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      subject: "",
      semester: "",
      chapter: "",
      dueDate: "",
      pdf: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      subject: Yup.string().required("Subject is required"),
      semester: Yup.string().required("Semester is required"),
      chapter: Yup.string().required("Chapter is required"),
      dueDate: Yup.date()
        .required("Due date is required")
        .min(new Date(), "Due date cannot be in the past"),
      pdf: Yup.mixed().required("A PDF file is required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("file", values.pdf);
        formData.append("upload_preset", "hcanfoaf");

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/ddrncwamz/upload",
          formData
        );

        const pdfUrl = uploadRes.data.secure_url;

        const data = {
          title: values.title,
          description: values.description,
          subject: values.subject,
          semester: values.semester,
          chapter: values.chapter,
          dueDate: values.dueDate,
          fileUrl: pdfUrl,
          fileType: "pdf",
        };

        await axios.post(`/api/assignments`, data);

        formik.resetForm();
        window.location.reload();
      } catch (error) {
        console.error("Error uploading PDF or submitting form:", error);
      }
    },
  });

  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      formik.setFieldValue("pdf", event.currentTarget.files[0]);
    }
  };

  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSemester = event.target.value;
    formik.setFieldValue("semester", selectedSemester);
    const semesterData = SemestersData.find(
      (semester) => semester.semester === selectedSemester
    );
    if (semesterData) {
      setSubjects(semesterData.subjects); // Set subjects based on selected semester
    }
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubjectName = event.target.value;
    formik.setFieldValue("subject", selectedSubjectName);
    const subjectData = subjects.find(
      (subject) => subject.name === selectedSubjectName
    );
    if (subjectData) {
      setChapters(subjectData.chapters); // Set chapters based on selected subject
    }
  };

  return (
    <section className="w-full">
      <h2 className="text-white flex justify-center">Add Assignment</h2>
      <div className="max-w-lg mx-auto mt-8 bg-gray-800 p-6 rounded shadow-lg">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-white mb-1">
              Semester
            </label>
            <select
              id="semester"
              name="semester"
              className={`w-full px-3 py-2 border rounded focus:outline-none ${
                formik.touched.semester && formik.errors.semester
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.semester}
              onChange={handleSemesterChange}
            >
              <option value="">Select a semester</option>
              {SemestersData.map((semester) => (
                <option key={semester.semester} value={semester.semester}>
                  {semester.semester}
                </option>
              ))}
            </select>
            {formik.touched.semester && formik.errors.semester && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.semester}</p>
            )}
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-white mb-1">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              className={`w-full px-3 py-2 border rounded focus:outline-none ${
                formik.touched.subject && formik.errors.subject
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.subject}
              onChange={handleSubjectChange}
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.name} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            {formik.touched.subject && formik.errors.subject && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.subject}</p>
            )}
          </div>

          <div>
            <label htmlFor="chapter" className="block text-sm font-medium text-white mb-1">
              Chapter
            </label>
            <select
              id="chapter"
              name="chapter"
              className={`w-full px-3 py-2 border rounded focus:outline-none ${
                formik.touched.chapter && formik.errors.chapter
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.chapter}
              onChange={formik.handleChange}
            >
              <option value="">Select a chapter</option>
              {chapters.map((chapter) => (
                <option key={chapter.name} value={chapter.name}>
                  {chapter.name}
                </option>
              ))}
            </select>
            {formik.touched.chapter && formik.errors.chapter && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.chapter}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Upload PDF</label>
            <input
              type="file"
              accept=".pdf"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handlePdfChange}
            />
            {formik.errors.pdf && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.pdf}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAssignments;
