'use server';

/**
 * @fileoverview A flow to save a successful purchase to the Appwrite database.
 * This flow is designed to be called from the client-side after a successful
 * Razorpay payment.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Client, Databases, ID } from 'node-appwrite';
import { GenkitError } from 'genkit';

const SavePurchaseInputSchema = z.object({
  itemId: z.string(),
  userId: z.string(),
  paymentId: z.string(),
});

const SavePurchaseOutputSchema = z.object({
  success: z.boolean(),
  documentId: z.string().optional(),
  message: z.string(),
});

const savePurchaseFlow = ai.defineFlow(
  {
    name: 'savePurchaseFlow',
    inputSchema: SavePurchaseInputSchema,
    outputSchema: SavePurchaseOutputSchema,
  },
  async ({ itemId, userId, paymentId }) => {
    const endpoint = process.env.APPWRITE_ENDPOINT;
    const projectId = process.env.APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;
    const databaseId = process.env.APPWRITE_DATABASE_ID;
    const collectionId = process.env.APPWRITE_COLLECTION_ID;

    if (!endpoint || !projectId || !apiKey || !databaseId || !collectionId) {
      throw new GenkitError({
        status: 'FAILED_PRECONDITION',
        message: 'Appwrite environment variables are not fully configured.',
      });
    }

    const client = new Client();
    client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

    const databases = new Databases(client);

    try {
      const document = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          itemId: itemId,
          uid: userId,
          paymentid: paymentId,
          paymentStatus: 'success',
          ispurchased: true,
        }
      );

      return {
        success: true,
        documentId: document.$id,
        message: 'Purchase saved successfully.',
      };
    } catch (error: any) {
      console.error('Failed to save purchase to Appwrite:', error);
      throw new GenkitError({
        status: 'INTERNAL',
        message: `Could not save purchase to Appwrite: ${error.message}`,
      });
    }
  }
);

export async function savePurchase(
  input: z.infer<typeof SavePurchaseInputSchema>