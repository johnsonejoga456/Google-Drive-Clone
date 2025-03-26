"use client";
import { useState } from "react";
import { db, storage, DATABASE_ID, FILES_COLLECTION_ID, STORAGE_BUCKET_ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import { FileDocument } from "@/types/file";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Folder extends FileDocument {
  type: "folder";
}

interface FilesSectionProps {
  user: any;
  files: FileDocument[];
  setFiles: (files: FileDocument[]) => void;
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  setStorageUsed: (size: number) => void;
  currentFolder: string | null;
  setCurrentFolder: (folderId: string | null) => void;
  setRenameFile: (file: FileDocument | null) => void;
  setShareFile: (file: FileDocument | null) => void;
  setCreateFolder: (value: boolean) => void;
}

export default function FilesSection({
  user,
  files,
  setFiles,
  folders,
  setFolders,
  setStorageUsed,
  currentFolder,
  setCurrentFolder,
  setRenameFile,
  setShareFile,
  setCreateFolder,
}: FilesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = async (file: FileDocument) => {
    if (!user) return;
    try {
      await storage.deleteFile(STORAGE_BUCKET_ID, file.bucketField);
      await db.deleteDocument(DATABASE_ID, FILES_COLLECTION_ID, file.$id);

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
    } catch (error: any) {
      console.error("Delete Error:", error.message);
    }
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-purple-300/50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-purple-900">
          {currentFolder ? `Files in ${folders.find(f => f.$id === currentFolder)?.name}` : "My Files"}
        </h2>
        <div className="flex space-x-2">
          {currentFolder && (
            <Button
              onClick={() => setCurrentFolder(null)}
              className="text-purple-900 border-purple-300 hover:bg-purple-100"
            >
              Back to Root
            </Button>
          )}
          <Button
            onClick={() => setCreateFolder(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-purple-900"
          >
            Create Folder
          </Button>
          <Input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/3 border-indigo-200 bg-indigo-50 text-purple-900 placeholder-indigo-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Display Folders */}
      {folders.length > 0 && !currentFolder && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Folders</h3>
          <ul className="space-y-2">
            {folders.map((folder) => (
              <li
                key={folder.$id}
                className="flex justify-between items-center p-2 bg-indigo-50 rounded-lg cursor-pointer"
                onClick={() => setCurrentFolder(folder.$id)}
              >
                <span className="text-purple-900">{folder.name}</span>
                <span className="text-indigo-400 text-sm">Folder</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display Files */}
      {filteredFiles.length > 0 ? (
        <ul className="space-y-4">
          {filteredFiles.slice(0, 5).map((file) => (
            <li
              key={file.$id}
              className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg"
            >
              <span className="text-purple-900">{file.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-indigo-400 text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(file.url, "_blank")}
                  className="text-purple-900 border-purple-300 hover:bg-purple-100"
                >
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = file.url;
                    link.download = file.name;
                    link.click();
                  }}
                  className="text-purple-900 border-purple-300 hover:bg-purple-100"
                >
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRenameFile(file)}
                  className="text-purple-900 border-purple-300 hover:bg-purple-100"
                >
                  Rename
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShareFile(file)}
                  className="text-purple-900 border-purple-300 hover:bg-purple-100"
                >
                  Share
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(file)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-indigo-400">No files found.</p>
      )}
    </div>
  );
}