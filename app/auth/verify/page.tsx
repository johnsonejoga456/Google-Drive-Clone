"use client";
import { useRouter } from "next/navigation";

export default function Verify() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 ring-1 ring-purple-300/50 text-center">
        <h1 className="text-2xl font-semibold text-purple-900 mb-4">Check Your Email</h1>
        <p className="text-indigo-300 mb-6">
          We’ve sent a one-time code to your email. Click the link to complete your login or signup.
        </p>
        <button
          onClick={() => router.push("/auth/login")}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-purple-900 font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}