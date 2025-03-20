"use client";
import { Suspense } from "react";
import VerifyLogic from "./VerifyLogic";

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 ring-1 ring-purple-300/50 text-center">
        <h2 className="text-2xl font-semibold text-purple-900 mb-4">Logging In...</h2>
        {/* Wrap VerifyLogic in Suspense */}
        <Suspense fallback={<p className="text-indigo-300">Please wait while we verify your Magic URL...</p>}>
          <VerifyLogic />
        </Suspense>
      </div>
    </div>
  );
}