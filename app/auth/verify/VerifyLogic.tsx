"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { account, db, DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/appwrite";
import { Query } from "appwrite";

export default function VerifyLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const completeLogin = async () => {
      try {
        if (!userId || !secret) {
          throw new Error("Invalid Magic URL parameters: userId or secret is missing");
        }

        setStatus("loading");

        // Complete the Magic URL login by creating a session
        await account.createSession(userId, secret);

        // Get the user’s details
        const user = await account.get();

        // Check if the user exists in the users collection
        const users = await db.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [Query.equal("userId", user.$id)]
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

        setStatus("success");
        router.push("/dashboard");
      } catch (error) {
        if (error instanceof Error) {
          console.error("Verify Error:", error.message);
          setErrorMessage(error.message);
          setStatus("error");
          // Delay redirect to allow the user to see the error message
          setTimeout(() => {
            router.push(`/auth/login?error=${encodeURIComponent(error.message)}`);
          }, 2000);
        } else {
          console.error("An unknown error occurred:", error);
          setErrorMessage("An unknown error occurred");
          setStatus("error");
          setTimeout(() => {
            router.push(`/auth/login?error=An unknown error occurred`);
          }, 2000);
        }
      }
    };

    completeLogin();
  }, [userId, secret, router]);

  return (
    <div>
      {status === "loading" && (
        <p className="text-indigo-300">Please wait while we verify your Magic URL...</p>
      )}
      {status === "error" && (
        <p className="text-red-500">
          {errorMessage || "An error occurred while verifying your Magic URL."}
        </p>
      )}
      {status === "success" && <p className="text-green-500">Verification successful! Redirecting...</p>}
    </div>
  );
}