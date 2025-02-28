"use client";

import { useEffect, useState } from "react";
import { File } from "@/types/file";
import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FilePreview() {
  const [file, setFile] = useState<File | null>(null);
  const searchParams = useSearchParams();
  const fileId = searchParams.get("fileId");

  useEffect(() => {
    async function fetchFile() {
      const res = await fetch(`/api/files/get?fileId=${fileId}`);
      const data = await res.json();
      setFile(data);
    }
    fetchFile();
  }, [fileId]);

  if (!file) return <Loader className="animate-spin mx-auto mt-10" />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{file.name}</h1>
      <p className="text-sm text-gray-500">{file.mimeType}</p>
      <a href={file.url} target="_blank">
        <Button className="mt-4">Download</Button>
      </a>
    </div>
  );
}
