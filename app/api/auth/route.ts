import { NextResponse } from "next/server";
import { account } from "@/lib/appwrite";
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

    const userId = ID.unique();

    // Send Magic URL to the user's email
    await account.createMagicURLToken(
      userId,
      email,
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify`
    );

    console.log("Magic URL sent to:", email);

    return NextResponse.json(
      {
        success: true,
        message: "Magic URL sent to your email. Click the link to log in.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Auth Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}