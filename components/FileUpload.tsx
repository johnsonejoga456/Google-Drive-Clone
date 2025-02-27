"use client";

import { useState } from "react";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert("Please select a file!");

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,  
        });

        const data = await res.json();
        console.log(data);
        setUploading(false);
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
            </button>
        </div>
    );
}