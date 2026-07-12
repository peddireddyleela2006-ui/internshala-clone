import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import { googleSignIn } from "@/utils/googleAuth";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";

import { auth, provider } from "@/firebase/firebase";

import { useDispatch } from "react-redux";
import { login } from "@/Feature/Userslice";

import { Mail, Lock, User, Phone } from "lucide-react";
const Signup = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSignup = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.email ||
            !formData.phone ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            toast.error("Please fill all fields");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            // Create user in Firebase
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );

            const firebaseUser = userCredential.user;

            // Save user in MongoDB
            await axios.post(
                "https://internshala-clone-zril.onrender.com/api/user/register",
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    provider: "email",
                }
            );

            dispatch(
                login({
                    uid: firebaseUser.uid,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,

                })
            );

            toast.success("Account created successfully!");

            router.push("/");

        } catch (error: any) {
            console.log(error);

            if (error.code === "auth/email-already-in-use") {
                toast.error("Email already exists");
            } else {
                toast.error("Registration failed");
            }
        } finally {
            setLoading(false);
        }
    };
    const handleGoogleSignup = async () => {
        try {
            const firebaseUser = await googleSignIn();

            dispatch(
                login({
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photo: firebaseUser.photoURL,
                })
            );

            toast.success("Logged in successfully");

            router.push("/");
        } catch (error) {
            console.log(error);
            toast.error("Google Sign-In failed");
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="text-black bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-2">
                    Sign Up
                </h1>

                <p className="text-black-500 text-center mb-6">
                    Register to continue
                </p>

                <form
                    className="space-y-4"
                    onSubmit={handleSignup}
                >

                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        {loading ? "Signing Up..." : "Create Account"}
                    </button>

                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow h-px bg-gray-300"></div>
                    <span className="px-3 text-gray-500">OR</span>
                    <div className="flex-grow h-px bg-gray-300"></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="w-full border py-3 rounded-lg hover:bg-gray-100"
                >
                    Continue with Google
                </button>

                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-blue-600 font-semibold"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Signup;