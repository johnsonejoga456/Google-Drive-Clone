import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '');

export const account = new Account(client);
export const db = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? '';
export const FILES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID ?? '';
export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID ?? '';

// Throw error if critical vars are missing
if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
    !process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ||
    !process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID ||
    !process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID) {
  throw new Error('Missing required Appwrite environment variables');
}