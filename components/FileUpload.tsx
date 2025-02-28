"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function FileUpload() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return alert("Please select a file");

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("File uploaded successfully");
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Upload File</h2>
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 w-full rounded-lg mb-4"
        />
        <button
          onClick={uploadFile}
          disabled={uploading}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg ${
            uploading ? "opacity-50" : "hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
