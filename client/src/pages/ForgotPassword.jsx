import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";

import OAuth from "../components/OAuth";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  function onChange(e) {
    setEmail(e.target.value);
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address. Please enter a valid email.");
      } else if (error.code === "auth/user-not-found") {
        toast.error("No user found with this email.");
      } else {
        toast.error("Could not send reset password email. Please try again.");
      }
    }
  }

  return (
    <div className="p-10 relative min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 opacity-30"></div>
      <div className="absolute inset-0 bg-radial-gradient from-gray-900 to-transparent opacity-20"></div>

      <div className="relative p-6 max-w-md mx-auto bg-white rounded-lg shadow-2xl z-10 backdrop-blur-md">
        <h1 className="text-4xl font-semibold text-center my-7 text-gray-900">Forgot Password</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            id="email"
            value={email}
            onChange={onChange}
            placeholder="Email address"
            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg uppercase hover:bg-gradient-to-l disabled:opacity-80 transition duration-300"
          >
            Send reset password
          </button>

          <div className="flex flex-col items-center mt-5 gap-2">
            <div className="flex gap-2 justify-center items-center">
              <p className="text-gray-700">Don't have an account?</p>
              <Link to={'/sign-up'}>
                <span className="text-blue-600 font-semibold hover:underline transition duration-300">Register</span>
              </Link>
            </div>
            <Link
              to="/sign-in"
              className="text-blue-600 font-semibold hover:underline transition duration-300"
            >
              Sign in instead
            </Link>
          </div>

          <div className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
            <p className="text-center font-semibold mx-4">OR</p>
          </div>
          <OAuth />
        </form>
      </div>
    </div>
  );
}
