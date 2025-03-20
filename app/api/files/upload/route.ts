import { NextResponse } from "next/server";
import { storage, db, account, DATABASE_ID, FILES_COLLECTION_ID, STORAGE_BUCKET_ID } from "@/lib/appwrite"; // Added account
import { ID } from "appwrite";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
  }

  try {
    // Ensure user is authenticated (server-side)
    const user = await account.get();

    // Upload file to Appwrite Storage
    const uploadResponse = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file,
      ["role:member"]
    );

    // Get file URL (getFilePreview returns a string, so no .href needed)
    const fileUrl = storage.getFilePreview(
      STORAGE_BUCKET_ID,
      uploadResponse.$id
    ); // Returns a string URL directly

    // Store file metadata in the files collection
    await db.createDocument(
      DATABASE_ID,
      FILES_COLLECTION_ID,
      ID.unique(),
      {
        userId: user.$id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        bucketField: STORAGE_BUCKET_ID,
        accountId: user.$id,
        owner: user.$id,
        extension: file.name.split('.').pop() || '',
        users: [user.$id], // Initial sharing with the owner
      },
      ["role:member"]
    );

    return NextResponse.json({ success: true, fileUrl }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: "An unknown error occurred" }, { status: 500 });
  }
}
