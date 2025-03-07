"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db, storage, DATABASE_ID, FILES_COLLECTION_ID, STORAGE_BUCKET_ID } from "@/lib/appwrite";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { ID } from "appwrite";

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [shareUserId, setShareUserId] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const response = await db.listDocuments(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        [`equal("userId", "${user.$id}")`]
      );

      setFiles(response.documents);

      const totalSize = response.documents.reduce((sum, file) => sum + file.size, 0);
      setStorageUsed(totalSize / 1024 / 1024); // Convert to MB
    } catch (error) {
      toast.error("Failed to fetch files. Try again.");
    } finally {
      setDataLoading(false);
    }
  };

  const storageData = [
    { name: "Used", value: storageUsed },
    { name: "Free", value: 1024 - storageUsed }, // 1GB total
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file,
        undefined,
        (progress) => {
          if (progress.chunksTotal > 0) {
            const percentage = Math.round((progress.chunksUploaded / progress.chunksTotal) * 100);
            setUploadProgress(percentage);
          }
        }
      );

      const fileUrl = storage.getFilePreview(STORAGE_BUCKET_ID, response.$id);

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
          users: [user.$id],
        }
      );

      toast.success("File uploaded successfully");
      fetchData();
    } catch (error) {
      toast.error("File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadFile = (url: string) => {
    window.open(url, "_blank");
  };

  const handleDeleteFile = async (fileId: string, bucketId: string, documentId: string) => {
    try {
      await storage.deleteFile(bucketId, fileId);
      await db.deleteDocument(DATABASE_ID, FILES_COLLECTION_ID, documentId);

      toast.success("File deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const handleShareFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileId || !shareUserId) {
      toast.warn("Please select a file and enter a user ID");
      return;
    }

    try {
      const file = files.find((f) => f.$id === selectedFileId);
      if (!file) throw new Error("File not found");

      await db.updateDocument(DATABASE_ID, FILES_COLLECTION_ID, selectedFileId, {
        users: [...file.users, shareUserId],
      });

      toast.success(`File shared with user ID: ${shareUserId}`);
      setShareUserId("");
      setSelectedFileId(null);
    } catch (error) {
      toast.error("Failed to share file");
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-purple-700">
        <p className="text-yellow-400 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-900 to-indigo-800">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl text-yellow-400 font-bold">Welcome, {user.email}</h1>

        <Button onClick={logout} className="bg-yellow-400 text-purple-900">
          Log Out
        </Button>

        {/* Storage Usage Chart */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-purple-900 font-semibold text-xl">Storage Usage</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={storageData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-purple-900 font-semibold text-xl">Upload File</h2>
          <Input type="file" onChange={handleFileUpload} disabled={uploading} />
          {uploading && <p className="text-sm">Uploading... {uploadProgress}%</p>}
        </div>

        {/* All Files List */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-purple-900 font-semibold text-xl">All Files</h2>
          {files.length > 0 ? (
            files.map((file) => (
              <div key={file.$id} className="flex justify-between p-3 border-b">
                <span>{file.name}</span>
                <div className="space-x-2">
                  <Button size="sm" onClick={() => handleDownloadFile(file.url)}>
                    Download
                  </Button>
                  <Button size="sm" onClick={() => handleDeleteFile(file.$id, STORAGE_BUCKET_ID, file.$id)}>
                    Delete
                  </Button>
                  <Button size="sm" onClick={() => setSelectedFileId(file.$id)}>
                    Share
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No files uploaded yet</p>
          )}
        </div>

        {/* Share File Modal */}
        {selectedFileId && (
          <form onSubmit={handleShareFile} className="bg-white rounded-lg p-6">
            <Input
              type="text"
              placeholder="Enter User ID"
              value={shareUserId}
              onChange={(e) => setShareUserId(e.target.value)}
            />
            <Button type="submit" className="mt-3">
              Share
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
