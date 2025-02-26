import { NextResponse } from "next/server";
import { account } from "@/lib/appwrite";

export async function POST(req: Request) {
  try {
    const { userId, secret } = await req.json();

    // Verify the OTP session
    const session = await account.updateMagicURLSession(userId, secret);

    return NextResponse.json({ success: true, session }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
