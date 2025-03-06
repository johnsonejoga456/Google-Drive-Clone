import { NextResponse } from "next/server";
import { account, db, DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/appwrite";
import { ID } from "appwrite";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Generate a unique user ID
    const userId = ID.unique();

    try {
      // Send OTP to Email ✅
      const emailToken = await account.createEmailToken(userId, email); // Provide both userId and email

      // Optional: Store user data in Appwrite Database
      await db.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        {
          userId: userId,
          email: email,
          fullName: "",
          avatar: "",
          account: userId,
        }
      );

      console.log("OTP sent to:", email);

      return NextResponse.json(
        {
          success: true,
          message: "OTP sent to your email",
          userId: userId, // Pass userId and email to the frontend
          email: email,
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("User already exists or failed to create:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Auth Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
