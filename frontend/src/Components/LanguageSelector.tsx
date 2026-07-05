"use client";

import React, { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import OtpModal from "./OtpModal";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "pt", label: "Portuguese", flag: "🇵🇹" },
  { code: "zh", label: "Chinese", flag: "🇨🇳" },
  { code: "fr", label: "French", flag: "🇫🇷" },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const user = useSelector(selectuser);

  const [open, setOpen] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage =
    languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = async (lang: string) => {
    if (lang !== "fr") {
      i18n.changeLanguage(lang);
      localStorage.setItem("language", lang);
      setOpen(false);
      return;
    }

    if (!user?.email) {
      alert("User email not found.");
      return;
    }

    try {
      console.log("Sending OTP to:", user.email);

      const response = await fetch(
        "https://internshala-clone-zril.onrender.com/api/otp/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        alert(data.message || "Failed to send OTP");
        return;
      }

      setShowOtpModal(true);
      setOpen(false);
    } catch (error) {
      console.error("OTP Error:", error);
      alert("Could not connect to backend.");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border px-3 py-2 rounded-md text-black"
      >
        <Globe size={18} />
        <span>{currentLanguage.flag}</span>
        <span>{currentLanguage.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-white shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex w-full items-center gap-3 px-4 py-3 hover:bg-blue-300 text-black"
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
      <div className="text-black">
        {showOtpModal && (
          <OtpModal

            email={user.email}
            onClose={() => setShowOtpModal(false)}
            onSuccess={() => {
              i18n.changeLanguage("fr");
              localStorage.setItem("language", "fr");
              setShowOtpModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}