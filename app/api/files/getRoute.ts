import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/appwrite";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");

  try {
    const response = await database.getDocument("filesDB", "files", fileId!);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ message: "File not found" }, { status: 404 });
  }
}
