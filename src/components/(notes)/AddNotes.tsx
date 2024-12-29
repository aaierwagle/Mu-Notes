"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";



const Addnotes = () => {


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
      semester: Yup.number().required("Semester is required").positive().integer(),
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
        // toast.error("Error uploading PDF or submitting form");
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
    <>
      <section className="w-full">
        <h2 className="text-white flex justify-center">Add Document</h2>
        <div className="max-w-lg mx-auto mt-8 bg-gray-800 p-6 rounded shadow-lg">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-white mb-1"
              >
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

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-white mb-1"
              >
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

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-white mb-1"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className={`w-full px-3 py-2 border rounded focus:outline-none ${
                  formik.touched.subject && formik.errors.subject
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={formik.values.subject}
                onChange={formik.handleChange}
              />
              {formik.touched.subject && formik.errors.subject && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.subject}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="semester"
                className="block text-sm font-medium text-white mb-1"
              >
                Semester
              </label>
              <input
                type="number"
                id="semester"
                name="semester"
                className={`w-full px-3 py-2 border rounded focus:outline-none ${
                  formik.touched.semester && formik.errors.semester
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={formik.values.semester}
                onChange={formik.handleChange}
              />
              {formik.touched.semester && formik.errors.semester && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.semester}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="chapter"
                className="block text-sm font-medium text-white mb-1"
              >
                Chapter
              </label>
              <input
                type="text"
                id="chapter"
                name="chapter"
                className={`w-full px-3 py-2 border rounded focus:outline-none ${
                  formik.touched.chapter && formik.errors.chapter
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={formik.values.chapter}
                onChange={formik.handleChange}
              />
              {formik.touched.chapter && formik.errors.chapter && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.chapter}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Upload PDF
              </label>
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
    </>
  );
};

export default Addnotes;
