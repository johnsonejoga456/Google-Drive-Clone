import { storage } from "@/lib/appwrite";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const files = await storage.listFiles("files");
    return NextResponse.json({ success: true, files: files.files }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
