"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";

export default function Callback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      const userId = searchParams.get("userId");
      const secret = searchParams.get("secret");

      if (!userId || !secret) {
        setError("Invalid authentication link.");
        setLoading(false);
        return;
      }

      try {
        await account.updateMagicURLSession(userId, secret);
        router.push("/dashboard");
      } catch (err: any) {
        setError(err.message || "OTP verification failed.");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700">
        <p className="text-indigo-200 text-lg font-medium">Verifying OTP...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700">
        <div className="text-center">
          <p className="text-yellow-400 text-lg font-semibold">{error}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null; // Redirecting happens in useEffect
}