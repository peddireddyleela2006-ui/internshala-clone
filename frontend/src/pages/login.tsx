import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "@/firebase/firebase";
import { toast } from "react-toastify";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      toast.success("Login Successful!");

      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);

      toast.success("Login Successful!");

      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="text-black min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <form
          onSubmit={handleEmailLogin}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              className="w-full border rounded-lg p-3"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              className="w-full border rounded-lg p-3"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Continue with Google
        </button>

        <p className="text-center mt-6">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-semibold"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;