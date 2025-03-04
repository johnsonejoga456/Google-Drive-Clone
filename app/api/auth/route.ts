import { NextResponse } from "next/server";
import { account, db, DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/appwrite";
import { ID } from "appwrite";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    // Handle Registration/Login
    let user;
    try {
      user = await account.get();
    } catch (error) {
      // Create a new user if not found
      user = await account.create(ID.unique(), email, "");
      await db.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          email: email,
          fullname: "",g
        },
      );
    }

    // Generate OTP
    const token = await account.createEmailToken(ID.unique(), email);
    const generatedOtp = token.secret;
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Store OTP
    await db.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id, {
      otp: generatedOtp,
      expires,
    });

    return NextResponse.json({
      success: true,
      message: user.email === email ? "OTP sent for login" : "Registration successful! OTP sent for verification",
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
