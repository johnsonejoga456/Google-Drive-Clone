"use client";

import { useEffect, useState } from "react";

interface FileType {
  $id: string;
  name: string;
}

export default function FileList() {
  const [files, setFiles] = useState<FileType[]>([]);

  useEffect(() => {
    async function fetchFiles() {
      const res = await fetch("/api/files");
      const data = await res.json();
      setFiles(data.files);
    }
    fetchFiles();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {files.map((file) => (
        <div key={file.$id} className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition">
          <p className="font-semibold">{file.name}</p>
          <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Download
          </button>
        </div>
      ))}
    </div>
  );
}
