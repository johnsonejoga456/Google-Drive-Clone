import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

client
    .setEndpoint(process.env.APPWRITE_ENDPOINT as string) // Your API Endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID as string) // Your project ID

// Initialize the Appwrite SDK
export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);