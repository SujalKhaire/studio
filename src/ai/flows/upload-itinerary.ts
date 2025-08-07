'use server';

import {z} from 'zod';
import {
  addDoc,
  collection,
  doc,
  runTransaction,
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
      const newId = await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, 'counters', 'itineraries');
        const counterDoc = await transaction.get(counterRef);

        let newCount;
        if (!counterDoc.exists()) {
          // If the counter doc doesn't exist, this is the first itinerary.
          newCount = 1;
        } else {
          newCount = counterDoc.data().count + 1;
        }
        
        transaction.set(counterRef, { count: newCount }, { merge: true });

        return newCount;
      });
      
      const itinerariesCollection = collection(db, 'itineraries');
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
