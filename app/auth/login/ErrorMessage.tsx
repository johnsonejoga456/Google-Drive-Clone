"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface ErrorMessageProps {
  setError: (error: string | null) => void;
}

export default function ErrorMessage({ setError }: ErrorMessageProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      setError(decodeURIComponent(urlError));
    }
  }, [searchParams, setError]);

  return null; // This component doesn't render anything
}