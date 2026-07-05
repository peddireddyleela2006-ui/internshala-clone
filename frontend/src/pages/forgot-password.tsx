import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function ForgotPassword() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!identifier.trim()) {
      toast.error("Please enter your email or phone number.");
      return;
    }

    setLoading(true);

    try {
      const body = identifier.includes("@")
        ? { email: identifier }
        : { phone: identifier };

      const response = await fetch(
        "http://localhost:5000/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      router.push("/login");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className=" text-black bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Forgot Password
        </h1>

        <p className="text-gray-600 mb-6 text-center">
          Enter your registered email or phone number.
        </p>

        <form
          onSubmit={handleReset}
          className="space-y-5"
        >
          <input
            type="text"
            placeholder="Email or Phone"
            value={identifier}
            onChange={(e) =>
              setIdentifier(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Please wait..." : "Generate Password"}
          </button>
        </form>
      </div>
    </div>
  );
}