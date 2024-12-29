// "use client"
import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

// Define the types for the form values
interface AdminLoginValues {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  // Define initial values with the proper types
  const initialValues: AdminLoginValues = {
    email: "",
    password: "",
  };

  // Define validation schema with Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Required"),
    password: Yup.string().required("Required"),
  });

  // Define the onSubmit function with the correct typing
  const onSubmit = (
    values: AdminLoginValues,
    { setSubmitting }: FormikHelpers<AdminLoginValues>
  ) => {
    // Add your login logic here
    console.log(values);
    setSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-bold mb-2">
                Email:
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-bold mb-2">
                Password:
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Login
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AdminLogin;
