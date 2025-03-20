import { Models } from "appwrite";

export interface FileDocument extends Models.Document {
  userId: string;
  name: string;
  size: number;
  type: string;
  url: string;
  bucketField: string;
  accountId: string;
  owner: string;
  extension: string;
  users: string[];
}