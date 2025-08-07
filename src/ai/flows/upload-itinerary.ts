'use server';

import {z} from 'zod';
import {
  addDoc,
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import {ai} from '@/ai/genkit';

const UploadItineraryInputSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  itineraryLink: z.string().url({ message: 'Please enter a valid URL.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  userId: z.string(),
});


const uploadItineraryFlow = ai.defineFlow(
  {
    name: 'uploadItinerary',
    inputSchema: UploadItineraryInputSchema,
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
      itineraryId: z.string().optional(),
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

        return newCount.toString();
      });
      
      const itinerariesCollection = collection(db, 'itineraries');
      await addDoc(itinerariesCollection, {
        title: input.title,
        publicLink: input.itineraryLink,
        price: input.price,
        userId: input.userId,
        id: newId,
        status: 'Draft',
        createdAt: serverTimestamp(),
        sales: 0,
        earnings: 0,
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
