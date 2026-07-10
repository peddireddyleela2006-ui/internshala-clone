import { useState } from "react";

interface OtpModalProps {
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OtpModal({
  email,
  onClose,
  onSuccess,
}: OtpModalProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://internshala-clone-zril.onrender.com/api/otp/verify-otp`,
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

      if (data.success) {
        alert("OTP verified successfully!");
        onSuccess();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          French Verification
        </h2>

        <p className="text-gray-600 text-center mb-4">
          Enter the OTP sent to
        </p>

        <p className="text-center font-semibold mb-4 break-all text-black">
          {email}
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 text-center text-lg text-black"
        />

        <button
          onClick={verifyOtp}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 border border-gray-400 text-black py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}