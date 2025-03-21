"use client";
import { useState, useEffect } from "react"; // Add useEffect
import { useAuth } from "@/context/AuthContext";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import ErrorMessage from "./ErrorMessage";

export default function LoginPage() {
  const { loading } = useAuth();
  const [email, setEmail] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Debug logging for error state
  useEffect(() => {
    if (error) {
      console.log("Error state updated:", error);
    } else {
      console.log("Error state cleared");
    }
  }, [error]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (loading) return;

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Magic URL sent! Check your email to log in.");
      } else {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Authentication failed. Please try again.");
      }
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

        {/* Login/Registration Form */}
        {!isSignup && (
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-purple-900 text-center">Welcome Back</h2>
              <p className="text-sm text-indigo-300 text-center mt-1">
                Enter your email to receive a Magic URL
              </p>
              <Suspense fallback={<div>Loading error message...</div>}>
                <ErrorMessage setError={setError} />
              </Suspense>
              {error && <p className="text-yellow-400 text-sm text-center mt-2">{error}</p>}
              {success && <p className="text-green-500 text-sm text-center mt-2">{success}</p>}
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Magic URL"
              )}
            </Button>
            <p className="text-center text-indigo-400 mt-4">
              Don’t have an account?{" "}
              <button
                onClick={() => setIsSignup(true)}
                className="text-yellow-400 hover:text-orange-500 font-semibold"
              >
                Sign Up
              </button>
            </p>
          </form>
        )}

        {/* Sign Up Modal */}
        <Dialog open={isSignup} onOpenChange={setIsSignup}>
          <DialogContent className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-purple-300/50">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-purple-900 text-center">
                Create Your Account
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <p className="text-sm text-indigo-300 text-center mt-1">
                  Register with your email to start using DriveClone
                </p>
                <Suspense fallback={<div>Loading error message...</div>}>
                  <ErrorMessage setError={setError} />
                </Suspense>
                {error && <p className="text-yellow-400 text-sm text-center mt-2">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center mt-2">{success}</p>}
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
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Registering...
                  </span>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
            <DialogFooter className="mt-4">
              <button
                onClick={() => setIsSignup(false)}
                className="text-indigo-400 hover:text-purple-900 transition-colors"
              >
                Cancel
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <p className="text-xs text-indigo-200 text-center mt-6">
          Powered by <span className="font-semibold text-yellow-400">xAI</span>
        </p>
      </div>
    </div>
  );
}