import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/firebase/firebase";
import { googleSignIn } from "@/utils/googleAuth";

import { useDispatch } from "react-redux";
import { login } from "@/Feature/Userslice";


const Login = () => {

  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const firebaseUser =
        userCredential.user;


      dispatch(
        login({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || "",
          photo: firebaseUser.photoURL || "",
        })
      );
      try {
        await fetch(
          `https://internshala-clone-zril.onrender.com/api/loginhistory/save`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: firebaseUser.email,
            }),
          }
        );
      } catch (err) {
        console.error("Failed to save login history:", err);
      }

      toast.success("Login successful");

      router.push("/");


    } catch (error) {

      console.log(error);

      toast.error("Invalid email or password");

    }

  };


  const handleGoogleLogin = async () => {

    try {

      const firebaseUser =
        await googleSignIn();


      dispatch(
        login({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
        })
      );

      try {
        await fetch(
          `https://internshala-clone-zril.onrender.com/api/loginhistory/save`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: firebaseUser.email,
            }),
          }
        );
      } catch (err) {
        console.error("Failed to save login history:", err);
      }
      toast.success("Login successful");

      router.push("/");


    } catch (error) {

      console.log(error);

      toast.error("Google login failed");

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">


        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Login
        </h1>


        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-black"
          />


          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-black"
          />


          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Login
          </button>

        </form>


        <button
          onClick={handleGoogleLogin}
          className="text-black w-full border mt-4 py-3 rounded-lg px-4 py-2 border-black font-bold hover:bg-blue-200 transition"
        >
          Continue with Google
        </button>


        <div className="text-center mt-4">

          <Link
            href="/forgot-password"
            className="text-blue-600"
          >
            Forgot Password?
          </Link>

        </div>


        <p className="text-center mt-6 text-gray-600">

          Don't have an account?

          <Link
            href="/signup"
            className="text-blue-600 ml-2"
          >
            Sign Up
          </Link>

        </p>


      </div>

    </div>

  );
};


export default Login;