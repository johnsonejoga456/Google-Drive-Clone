"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  db,
  storage,
  DATABASE_ID,
  FILES_COLLECTION_ID,
  STORAGE_BUCKET_ID,
} from "@/lib/appwrite";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ID } from "appwrite";

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await db.listDocuments(
          DATABASE_ID,
          FILES_COLLECTION_ID,
          [`equal("userId", "${user.$id}")`]
        );

        const userFiles = response.documents;
        setFiles(userFiles);

        const totalSize = userFiles.reduce((sum, file) => sum + file.size, 0);
        setStorageUsed(totalSize / 1024 / 1024); // Convert to MB
      } catch (error) {
        console.error("Dashboard: Error fetching data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, router]);

  const storageData = [
    { name: "Used", value: storageUsed },
    { name: "Free", value: 1024 - storageUsed }, // Assuming 1GB limit
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Upload File with Progress Tracking
      const response = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file,
        ["user:" + user.$id], // Permissions
        (progress) => setUploadProgress(progress.progress)
      );

      // Generate Preview URL
      const fileUrl = storage.getFilePreview(STORAGE_BUCKET_ID, response.$id);

      // Save Metadata to Database
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
          extension: file.name.split(".").pop() || "",
        },
        ["user:" + user.$id] // Document Permissions
      );

      // Refresh Files List
      const updatedResponse = await db.listDocuments(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        [`equal("userId", "${user.$id}")`]
      );
      setFiles(updatedResponse.documents);

      const totalSize = updatedResponse.documents.reduce((sum, file) => sum + file.size, 0);
      setStorageUsed(totalSize / 1024 / 1024);
    } catch (error) {
      console.error("Dashboard: Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700">
        <p className="text-indigo-200 text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-yellow-400">Welcome, {user.email}</h1>
          <Button
            onClick={logout}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-purple-900"
          >
            Log Out
          </Button>
        </div>

        {/* Storage Usage Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-purple-300/50">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">Storage Usage</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={storageData}>
              <XAxis dataKey="name" stroke="#9333ea" />
              <YAxis stroke="#9333ea" />
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }} />
              <Bar dataKey="value" fill="#facc15" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-indigo-400 mt-2">
            {storageUsed.toFixed(2)} MB of 1024 MB used
          </p>
        </div>

        {/* File List */}
        <div className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-purple-300/50">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">Recent Uploads</h2>
          {files.length > 0 ? (
            <ul className="space-y-4">
              {files.slice(0, 5).map((file) => (
                <li
                  key={file.$id}
                  className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg"
                >
                  <span className="text-purple-900">{file.name}</span>
                  <span className="text-indigo-400 text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-indigo-400">No files uploaded yet.</p>
          )}
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-purple-300/50">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">Upload Files</h2>
          <Input
            type="file"
            onChange={handleFileUpload}
            className="w-full text-indigo-400 mb-4"
            disabled={uploading}
          />
          {uploading && (
            <p className="text-indigo-400 text-sm">
              Uploading... {uploadProgress}%
            </p>
          )}
          {error && <p className="text-yellow-400 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
