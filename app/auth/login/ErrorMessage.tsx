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
      console.log("Error from query parameter:", urlError); // Debug log
      setError(decodeURIComponent(urlError));
    } else {
      console.log("No error in query parameter, clearing error state"); // Debug log
      setError(null); // Clear the error state if there's no error in the URL
    }
  }, [searchParams, setError]);

  return null;
}