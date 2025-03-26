"use client";
import { useState } from "react";
import { db, DATABASE_ID, FILES_COLLECTION_ID } from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import { FileDocument } from "@/types/file";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Folder extends FileDocument {
  type: "folder";
}

interface CreateFolderDialogProps {
  user: any;
  createFolder: boolean;
  setCreateFolder: (value: boolean) => void;
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
}

export default function CreateFolderDialog({
  user,
  createFolder,
  setCreateFolder,
  folders,
  setFolders,
}: CreateFolderDialogProps) {
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = async () => {
    if (!user || !newFolderName) return;
    try {
      await db.createDocument(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        ID.unique(),
        {
          name: newFolderName,
          type: "folder",
          size: 0,
          accountId: user.$id,
          owner: user.email,
          users: [user.$id],
        },
        ["users"]
      );

      const folderResponse = await db.listDocuments(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        [Query.equal("accountId", user.$id), Query.equal("type", "folder")]
      );
      setFolders(folderResponse.documents as Folder[]);

      setCreateFolder(false);
      setNewFolderName("");
    } catch (error: any) {
      console.error("Create Folder Error:", error.message);
    }
  };

  return (
    <Dialog open={createFolder} onOpenChange={() => setCreateFolder(false)}>
      <DialogContent className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-purple-300/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-purple-900 text-center">
            Create Folder
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="w-full border-indigo-200 bg-indigo-50 text-purple-900 placeholder-indigo-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            placeholder="Enter folder name"
          />
        </div>
        <DialogFooter className="mt-4">
          <Button
            onClick={() => setCreateFolder(false)}
            className="text-indigo-400 hover:text-purple-900 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateFolder}
            disabled={!newFolderName}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-purple-900 font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}