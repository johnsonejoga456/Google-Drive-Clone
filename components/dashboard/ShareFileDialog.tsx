"use client";
import { useState } from "react";
import { db, DATABASE_ID, FILES_COLLECTION_ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import { FileDocument } from "@/types/file";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface ShareFileDialogProps {
  user: any;
  shareFile: FileDocument | null;
  setShareFile: (file: FileDocument | null) => void;
  files: FileDocument[];
  setFiles: (files: FileDocument[]) => void;
  currentFolder: string | null;
}

export default function ShareFileDialog({
  user,
  shareFile,
  setShareFile,
  files,
  setFiles,
  currentFolder,
}: ShareFileDialogProps) {
  const [shareEmail, setShareEmail] = useState("");

  const handleShare = async () => {
    if (!user || !shareFile) return;
    try {
      const updatedUsers = [...(shareFile.users || []), shareEmail];

      await db.updateDocument(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        shareFile.$id,
        {
          users: updatedUsers,
        }
      );

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

      setShareFile(null);
      setShareEmail("");
    } catch (error: any) {
      console.error("Share Error:", error.message);
    }
  };

  return (
    <Dialog open={!!shareFile} onOpenChange={() => setShareFile(null)}>
      <DialogContent className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-purple-300/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-purple-900 text-center">
            Share File
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="email"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            className="w-full border-indigo-200 bg-indigo-50 text-purple-900 placeholder-indigo-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            placeholder="Enter email to share with"
          />
        </div>
        <DialogFooter className="mt-4">
          <Button
            onClick={() => setShareFile(null)}
            className="text-indigo-400 hover:text-purple-900 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            disabled={!shareEmail}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-purple-900 font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}