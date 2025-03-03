import { NextResponse } from "next/server";
import { account } from "@/lib/appwrite";
import { ID } from "appwrite";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const token = await account.createMagicURLToken(
      ID.unique(), // Generate a unique user ID
      email,
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback` // Redirect URL
    );

    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}