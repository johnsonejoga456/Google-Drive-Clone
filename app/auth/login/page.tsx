"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) setError(decodeURIComponent(urlError));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email);
      router.push("/auth/verify");
    } catch (error: any) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 ring-1 ring-purple-300/50 transform transition-all hover:scale-105">
        <div className="flex justify-center mb-6">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            DriveClone
          </h1>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsSignup(false)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-l-lg",
              !isSignup ? "bg-indigo-100 text-purple-900" : "bg-indigo-50 text-indigo-400 hover:text-purple-900"
            )}
          >
            Log In
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-r-lg",
              isSignup ? "bg-indigo-100 text-purple-900" : "bg-indigo-50 text-indigo-400 hover:text-purple-900"
            )}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-purple-900 text-center">
              {isSignup ? "Create Your Account" : "Welcome Back"}
            </h2>
            <p className="text-sm text-indigo-300 text-center mt-1">
              We'll send a one-time code to your email
            </p>
            {error && <p className="text-yellow-400 text-sm text-center mt-2">{error}</p>}
          </div>

          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-indigo-200 bg-indigo-50 text-purple-900 placeholder-indigo-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            disabled={loading}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-purple-900 font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-purple-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Sending...
              </span>
            ) : (
              "Send OTP"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}