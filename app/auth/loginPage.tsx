"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await login(email);
    alert("OTP Sent to your Email!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="email"
          className="border p-2 w-full mb-4"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-blue-500 text-white py-2 w-full">Login</button>
      </form>
    </div>
  );
}
