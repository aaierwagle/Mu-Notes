"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { SemestersData } from "@/constant/SemesterData";

// Define types for Subject and Chapter
interface Chapter {
  name: string;
  // add any other properties of a chapter if necessary
}

interface Subject {
  name: string;
  chapters: Chapter[];
}

const Addnotes = () => {
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]); // Specify type as Subject[]
  const [availableChapters, setAvailableChapters] = useState<Chapter[]>([]); // Specify type as Chapter[]

  useEffect(() => {
    if (selectedSemester) {
      // Find the subjects for the selected semester
      const semesterData = SemestersData.find(
        (semester) => semester.semester === selectedSemester
      );
      if (semesterData) {
        setAvailableSubjects(semesterData.subjects);
      }
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedSubject) {
      // Find the chapters for the selected subject
      const subjectData = availableSubjects.find(
        (subject) => subject.name === selectedSubject
      );
      if (subjectData) {
        setAvailableChapters(subjectData.chapters);
      }
    }
  }, [selectedSubject, availableSubjects]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      subject: "",
      semester: "",
      chapter: "",
      pdf: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      subject: Yup.string().required("Subject is required"),
      semester: Yup.string().required("Semester is required"),
      chapter: Yup.string().required("Chapter is required"),
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
        const publicId = uploadRes.data.public_id;

        const data = {
          title: values.title,
          description: values.description,
          subject: values.subject,
          semester: values.semester,
          chapter: values.chapter,
          fileUrl: pdfUrl,
          fileType: "pdf",
          publicId: publicId,
        };

        await axios.post(`/api/notes`, data);

        formik.resetForm();

        // Handle successful edit
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

  return (
    <section className="w-full">
      <h2 className="text-white flex justify-center">Add Document</h2>
      <div className="max-w-lg mx-auto mt-8 bg-gray-800 p-6 rounded shadow-lg">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`w-full px-3 py-2 border rounded focus:outline-none ${
                formik.touched.title && formik.errors.title
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.title}
              onChange={formik.handleChange}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={`w-full px-3 py-2 border rounded focus:outline-none ${
                formik.touched.description && formik.errors.description
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.description}
              onChange={formik.handleChange}
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
            )}
          </div>

          {/* Semester */}
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
              onChange={(e) => {
                formik.handleChange(e);
                setSelectedSemester(e.target.value);
              }}
            >
              <option value="">Select Semester</option>
              {SemestersData.map((semester, index) => (
                <option key={index} value={semester.semester}>
                  {semester.semester}
                </option>
              ))}
            </select>
            {formik.touched.semester && formik.errors.semester && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.semester}</p>
            )}
          </div>

          {/* Subject */}
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
              onChange={(e) => {
                formik.handleChange(e);
                setSelectedSubject(e.target.value);
              }}
            >
              <option value="">Select Subject</option>
              {availableSubjects.map((subject, index) => (
                <option key={index} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            {formik.touched.subject && formik.errors.subject && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.subject}</p>
            )}
          </div>

          {/* Chapter */}
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
              <option value="">Select Chapter</option>
              {availableChapters.map((chapter, index) => (
                <option key={index} value={chapter.name}>
                  {chapter.name}
                </option>
              ))}
            </select>
            {formik.touched.chapter && formik.errors.chapter && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.chapter}</p>
            )}
          </div>

          {/* PDF Upload */}
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

export default Addnotes;
