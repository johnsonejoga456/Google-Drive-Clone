"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login"); // Redirect to the login page
    }
  }, [user, router]);

  return null; // Nothing renders here; it redirects
}