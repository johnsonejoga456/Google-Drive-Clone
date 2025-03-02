"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email);
      alert("OTP Sent to your Email!");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  if (user) return null; // Redirecting to /dashboard

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="email"
          className="border p-2 w-full mb-4"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-blue-500 text-white py-2 w-full">Login</button>
      </form>
    </div>
  );
}