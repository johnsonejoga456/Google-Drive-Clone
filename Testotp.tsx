"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { account, db, DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/appwrite"; // Added db for database queries
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!userId || !email) throw new Error("Invalid request: Missing userId or email");

      // Fetch the stored OTP for this user from the database
      const documents = await db.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [`equal("userId", "${userId}")`, `equal("email", "${email}")`]
      );

      if (documents.documents.length === 0) throw new Error("No OTP found for this user.");
      const storedOtp = documents.documents[0].otp;
      const expires = new Date(documents.documents[0].expires);

      if (new Date() > expires) throw new Error("OTP expired.");
      if (otp !== storedOtp) throw new Error("Invalid OTP.");

      // Verify OTP with Appwrite and create session
      const session = await account.createSession(userId, otp);
      console.log("Session Created:", session);

      router.push("/dashboard"); // ✅ Redirect to dashboard after successful verification
    } catch (error: any) {
      setError(error.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 ring-1 ring-purple-300/50 text-center">
        <h2 className="text-2xl font-semibold text-purple-900 mb-4">Enter OTP</h2>
        {error && <p className="text-yellow-400 text-sm mb-4">{error}</p>}
        <form onSubmit={verifyOtp} className="space-y-6">
          <Input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border-indigo-200 bg-indigo-50 text-purple-900 placeholder-indigo-400 focus:ring-2 focus:ring-yellow-400"
            disabled={loading}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
        <button
          onClick={() => router.push("/auth/login")}
          className="mt-4 text-indigo-400 hover:text-purple-900"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}