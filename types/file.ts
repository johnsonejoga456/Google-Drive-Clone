export type FileType = {
  $id: string; // Appwrite file unique ID
  name: string;
  url: string;
  size: number; // Size in bytes
  type: string; // MIME type
  createdAt: string; // Timestamp
};
