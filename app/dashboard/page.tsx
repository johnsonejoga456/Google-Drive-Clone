"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db, DATABASE_ID, FILES_COLLECTION_ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import { FileDocument } from "@/types/file";
import { Button } from "@/components/ui/button";
import FileUploadSection from "@/components/dashboard/FileUploadSection";
import StorageUsageSection from "@/components/dashboard/StorageUsageSection";
import FilesSection from "@/components/dashboard/FilesSection";
import RenameFileDialog from "@/components/dashboard/RenameFileDialog";
import ShareFileDialog from "@/components/dashboard/ShareFileDialog";
import CreateFolderDialog from "@/components/dashboard/CreateFolderDialog";

interface Folder extends FileDocument {
  type: "folder";
}

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<FileDocument[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [storageUsed, setStorageUsed] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [renameFile, setRenameFile] = useState<FileDocument | null>(null);
  const [shareFile, setShareFile] = useState<FileDocument | null>(null);
  const [createFolder, setCreateFolder] = useState(false);

  // Fetch user files and folders on mount
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch folders
        const folderResponse = await db.listDocuments(
          DATABASE_ID,
          FILES_COLLECTION_ID,
          [Query.equal("accountId", user.$id), Query.equal("type", "folder")]
        );
        setFolders(folderResponse.documents as Folder[]);

        // Fetch files
        const fileResponse = await db.listDocuments(
          DATABASE_ID,
          FILES_COLLECTION_ID,
          [
            Query.equal("accountId", user.$id),
            Query.equal("type", "file"),
            currentFolder ? Query.equal("folderId", currentFolder) : Query.isNull("folderId"),
          ]
        );
        const userFiles = fileResponse.documents as FileDocument[];
        setFiles(userFiles);
        const totalSize = userFiles.reduce((sum, file) => sum + file.size, 0);
        setStorageUsed(totalSize / 1024 / 1024);
      } catch (error) {
        console.error("Dashboard: Error fetching data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, router, currentFolder]);

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
          <h1 className="text-3xl font-semibold text-yellow-400">
            Welcome, {user.email}
          </h1>
          <Button
            onClick={logout}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-purple-900"
          >
            Log Out
          </Button>
        </div>

        <FileUploadSection
          user={user}
          setFiles={setFiles}
          setStorageUsed={setStorageUsed}
          currentFolder={currentFolder}
        />

        <StorageUsageSection storageUsed={storageUsed} />

        <FilesSection
          user={user}
          files={files}
          setFiles={setFiles}
          folders={folders}
          setFolders={setFolders}
          setStorageUsed={setStorageUsed}
          currentFolder={currentFolder}
          setCurrentFolder={setCurrentFolder}
          setRenameFile={setRenameFile}
          setShareFile={setShareFile}
          setCreateFolder={setCreateFolder}
        />

        <RenameFileDialog
          user={user}
          renameFile={renameFile}
          setRenameFile={setRenameFile}
          files={files}
          setFiles={setFiles}
          currentFolder={currentFolder}
        />

        <ShareFileDialog
          user={user}
          shareFile={shareFile}
          setShareFile={setShareFile}
          files={files}
          setFiles={setFiles}
          currentFolder={currentFolder}
        />

        <CreateFolderDialog
          user={user}
          createFolder={createFolder}
          setCreateFolder={setCreateFolder}
          folders={folders}
          setFolders={setFolders}
        />
      </div>
    </div>
  );
}