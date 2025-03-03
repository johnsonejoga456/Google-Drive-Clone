import { NextResponse } from "next/server";
import { account } from "@/lib/appwrite";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Request a Magic URL (OTP authentication)
    const magicURL = await account.createMagicURLToken("unique()", email);

    return NextResponse.json({ success: true, magicURL }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status:500 });
  }
}
