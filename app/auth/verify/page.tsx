"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { account, db, DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/appwrite";
import { Query } from "appwrite";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    const completeLogin = async () => {
      try {
        if (!userId || !secret) {
          throw new Error("Invalid Magic URL parameters");
        }

        // Complete the Magic URL login by creating a session
        await account.createSession(userId, secret);

        // Get the user’s details
        const user = await account.get();

        // Check if the user exists in the users collection using Query helper
        const users = await db.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [Query.equal("userId", user.$id)] // Use Query.equal for proper syntax
        );

        if (users.documents.length === 0) {
          // User doesn’t exist in the database, create a new document
          await db.createDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            user.$id,
            {
              userId: user.$id,
              email: user.email,
              fullName: "",
              avatar: "",
            },
            ["users"]
          );
        }

        router.push("/dashboard");
      } catch (error) {
        if (error instanceof Error) {
          console.error("Verify Error:", error.message);
          router.push(`/auth/login?error=${encodeURIComponent(error.message)}`);
        } else {
          console.error("An unknown error occurred:", error);
          router.push(`/auth/login?error=An unknown error occurred`);
        }
      }
    };

    completeLogin();
  }, [userId, secret, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 ring-1 ring-purple-300/50 text-center">
        <h2 className="text-2xl font-semibold text-purple-900 mb-4">Logging In...</h2>
        <p className="text-indigo-300">Please wait while we verify your Magic URL.</p>
      </div>
    </div>
  );
}
