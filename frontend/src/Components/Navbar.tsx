import React, { use, useEffect, useRef, useState } from "react";
import globe from "../public/globe.svg";
import Link from "next/link";
import { auth, provider } from "../firebase/firebase";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
// import { signInWithPopup, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectuser } from "@/Feature/Userslice";
import { useTranslation } from "react-i18next";
import { Briefcase, GraduationCap, Users } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
// import axios from "axios";
import { googleSignIn } from "@/utils/googleAuth";
import { signOut } from "firebase/auth";
interface User {
  name: string;
  email: string;
  photo: string;
}
const Navbar = () => {
  const { t, i18n } = useTranslation();
  const user = useSelector(selectuser);
  const dispatch = useDispatch();
  const handlelogin = async () => {
    try {
      console.log("Before Google Sign In");

      const { firebaseUser, mongoUser } = await googleSignIn();

      console.log("Firebase User:", firebaseUser);
      console.log("Mongo User:", mongoUser);

      dispatch(
        login({
          _id: mongoUser._id,
          uid: firebaseUser.uid,
          name: mongoUser.name,
          email: mongoUser.email,
          photo: firebaseUser.photoURL,
        })
      );

      console.log("After Dispatch");

      toast.success(t("toast.loginSuccess"));

    } catch (error) {
      console.log(error);
    }
  };
  const handlelogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);




  return (
    <div className="relative">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="text-xl font-bold text-blue-600">
                <img
                  src="/globe.svg"
                  className="h-11 w-11"
                />
              </a>
            </div>
            {/* Navigation Links */}
            <div className="flex items-center gap-6">

              <LanguageSelector />
              {/*internship page*/}
              <Link
                href="/internship"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-black text-black hover:bg-blue-200 transition"
              >
                <GraduationCap className="w-5 h-5" />
                <span>{t("navbar.internships")}</span>
              </Link>
              {/* Job Page */}
              <Link
                href="/job"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-black text-black hover:bg-blue-200 transition"
              >
                <Briefcase className="w-5 h-5" />
                <span>{t("navbar.jobs")}</span>
              </Link>
              {/* Public Space Page */}
              <Link
                href="/publicspace"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-black text-black hover:bg-blue-200 transition"
              >
                <Users className="w-5 h-5" />
                <span>{t("navbar.publicspace")}</span>
              </Link>
              {/* Friends Page */}
              <Link
                href="/friends"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-black text-black hover:bg-blue-200 transition"
              >
                <Users className="w-5 h-5" />
                <span>{t("navbar.friends")}</span>
              </Link>
              {/* Search Bar */}
              <div className="flex items-center border bg-gray-100 rounded-full px-4 py-2">
                <Search size={16} className="text-gray-400 " />
                <input
                  type="text"
                  placeholder={t("navbar.search")}
                  className="text-black ml-2 bg-transparent focus:outline-none text-sm w-72"
                />
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/profile">
                    <img
                      src={user.photo}
                      alt="Profile"
                      className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full object-cover border flex-shrink-0 cursor-pointer"/>
                    
                  </Link>

                  <button
                    onClick={handlelogout}
                    className="px-4 py-2 rounded-lg border border-black text-black hover:bg-blue-200 transition"
                  >
                    {t("navbar.Logout")}
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className=" px-4 py-2 rounded-lg border border-black text-black font-bold hover:bg-blue-200 transition"
                  >
                    Login
                  </Link>
                  <button
                    onClick={handlelogin}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-black text-black hover:bg-blue-200 transition"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-gray-700">Google</span>
                  </button>

                  <a
                    href="/adminlogin"
                    className="px-4 py-2 rounded-lg border border-black text-black font-bold hover:bg-blue-200 transition"
                  >
                    {t("navbar.admin")}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

