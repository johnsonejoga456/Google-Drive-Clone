import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
    .setProject("67be6d2c0015999b3f87") // Your project ID

// Initialize the Appwrite SDK
export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);