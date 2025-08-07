'use server';

import {z} from 'zod';
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import {ai} from '@/ai/genkit';

const uploadItineraryFlow = ai.defineFlow(
  {
    name: 'uploadItinerary',
    inputSchema: z.object({
      title: z.string(),
      publicLink: z.string().url(),
      price: z.number().positive(),
      creatorId: z.string(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
      itineraryId: z.number().optional(),
    }),
  },
  async (input) => {
    try {
      const itinerariesCollection = collection(db, 'itineraries');

      // Get the last itineraryId to generate a new sequential ID
      const q = query(
        itinerariesCollection,
        orderBy('itineraryId', 'desc'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      const lastId = querySnapshot.empty
        ? 0
        : querySnapshot.docs[0].data().itineraryId;
      const newId = lastId + 1;

      await addDoc(itinerariesCollection, {
        ...input,
        itineraryId: newId,
        status: 'Draft',
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        message: 'Itinerary uploaded successfully.',
        itineraryId: newId,
      };
    } catch (error) {
      console.error('Error uploading itinerary:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      return {
        success: false,
        message: `Failed to upload itinerary: ${errorMessage}`,
      };
    }
  }
);


export async function uploadItinerary(input: z.infer<typeof uploadItineraryFlow.inputSchema>) {
    return uploadItineraryFlow(input);
}
