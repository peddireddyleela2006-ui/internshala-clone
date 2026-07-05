"use client";

import { useState } from "react";

type Props = {
  email: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function OtpModal({
  email,
  onClose,
  onSuccess,
}: Props) {
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    try {
      const response = await fetch(
        "https://internshala-clone-zril.onrender.comlone-zril.onrender.com/api/otp/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("OTP Verified!");

      onSuccess();
    } catch (err) {
      alert("Failed to verify OTP.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">

        <h2 className="text-xl font-bold mb-4">
          Enter OTP
        </h2>

        <input
          type="text"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value)}
          className="border w-full p-2 rounded"
          placeholder="Enter OTP"
        />

        <div className="flex gap-3 mt-5">

          <button
            onClick={verifyOtp}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Verify
          </button>

          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}