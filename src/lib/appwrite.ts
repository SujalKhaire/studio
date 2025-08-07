// lib/appwrite.ts
import { Client, Databases } from 'appwrite';

const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Replace with your endpoint
  .setProject('685821be0006034c0ca8'); // Replace with your project ID

const databases = new Databases(client);

export { client, databases };
