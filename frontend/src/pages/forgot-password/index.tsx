import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);


  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://internshala-clone-zril.onrender.com/api/passwordreset/request",
        {
          email,
        }
      );

      toast.success(response.data.message);

    } catch (error: any) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Password reset failed"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-4 text-black">
          Forgot Password
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Enter your registered email to reset your password
        </p>


        <form onSubmit={handleReset} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-black"
          />


          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>

        </form>


        <p className="text-center mt-6">
          <Link 
            href="/login"
            className="text-blue-600"
          >
            Back to Login
          </Link>
        </p>


      </div>

    </div>
  );
};


export default ForgotPassword;