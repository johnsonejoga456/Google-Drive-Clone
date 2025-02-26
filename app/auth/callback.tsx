"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Callback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (userId && secret) {
      login(userId, secret)
        .then(() => router.push("/dashboard"))
        .catch(() => setError("OTP verification failed."));
    } else {
      setError("Invalid authentication link.");
    }

    setLoading(false);
  }, [searchParams, login, router]);

  if (loading) return <p>Verifying OTP...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return null;
}
