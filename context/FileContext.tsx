"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { FileType } from "@/types/file";

type FileContextType = {
  files: FileType[];
  deleteFile: (id: string) => void;
  renameFile: (id: string) => void;
};

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileType[]>([]);

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.$id !== id));
  };

  const renameFile = (id: string) => {
    const newName = prompt("Enter new file name:");
    if (!newName) return;

    setFiles((prev) =>
      prev.map((file) =>
        file.$id === id ? { ...file, name: newName } : file
      )
    );
  };

  return (
    <FileContext.Provider value={{ files, deleteFile, renameFile }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFileContext() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
}
