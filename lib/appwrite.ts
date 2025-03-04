import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '');

export const account = new Account(client);
export const db = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!;
export const FILES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!;
export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET!;

if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
    !process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ||
    !process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION ||
    !process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION ||
    !process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET) {
  throw new Error('Missing required Appwrite environment variables');
}