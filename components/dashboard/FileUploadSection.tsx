"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { db, storage, DATABASE_ID, FILES_COLLECTION_ID, STORAGE_BUCKET_ID } from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import { FileDocument } from "@/types/file";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface User {
  $id: string;
  email: string;
}

interface FileUploadSectionProps {
  user: User;
  setFiles: (files: FileDocument[]) => void;
  setStorageUsed: (size: number) => void;
  currentFolder: string | null;
}

export default function FileUploadSection({
  user,
  setFiles,
  setStorageUsed,
  currentFolder,
}: FileUploadSectionProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Prevents ESLint warning
  useEffect(() => {
    console.log("setFiles function reference:", setFiles);
  }, [setFiles]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!user) return;
    if (selectedFiles.length === 0) {
      setUploadError("Please select at least one file to upload.");
      return;
    }

    setUploadLoading(true);
    setUploadError(null);

    try {
      for (const file of selectedFiles) {
        const uploadedFile = await storage.createFile(
          STORAGE_BUCKET_ID,
          ID.unique(),
          file
        );

        const extension = file.name.split(".").pop() || "";

        await db.createDocument(
          DATABASE_ID,
          FILES_COLLECTION_ID,
          ID.unique(),
          {
            name: file.name,
            url: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
            type: "file",
            bucketField: uploadedFile.$id,
            accountId: user.$id,
            owner: user.email,
            extension: extension,
            size: file.size,
            users: [user.$id],
            folderId: currentFolder || null,
          },
          ["users"]
        );
      }

      const response = await db.listDocuments(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        [
          Query.equal("accountId", user.$id),
          Query.equal("type", "file"),
          currentFolder ? Query.equal("folderId", currentFolder) : Query.isNull("folderId"),
        ]
      );
      const userFiles = response.documents as FileDocument[];
      setFiles(userFiles);
      const totalSize = userFiles.reduce((sum, file) => sum + file.size, 0);
      setStorageUsed(totalSize / 1024 / 1024);

      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload Error:", (error as Error).message);
      setUploadError("Failed to upload files. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-purple-300/50">
      <h2 className="text-xl font-semibold text-purple-900 mb-4">Upload Files</h2>
      <div className="space-y-4">
        <Input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full border-indigo-200 bg-indigo-50 text-purple-900 placeholder-indigo-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
          disabled={uploadLoading}
        />
        {selectedFiles.length > 0 && (
          <p className="text-indigo-400 text-sm">
            {selectedFiles.length} file(s) selected
          </p>
        )}
        {uploadError && (
          <p className="text-red-500 text-sm">{uploadError}</p>
        )}
        <Button
          onClick={handleUpload}
          disabled={uploadLoading || selectedFiles.length === 0}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-purple-900 font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          {uploadLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-purple-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload Files"
          )}
        </Button>
      </div>
    </div>
  );
}
