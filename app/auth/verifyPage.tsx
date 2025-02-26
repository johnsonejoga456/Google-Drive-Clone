"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function VerifyPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const verifyOTP = async () => {
    if (!userId || !secret) {
      setMessage("Invalid OTP link.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/verify", { userId, secret });
      if (response.data.success) {
        setMessage("Login successful! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Verify OTP</h2>
        <button
          onClick={verifyOTP}
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        {message && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>}
      </div>
    </div>
  );
}
