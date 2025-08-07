'use server';

import {z} from 'zod';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import {ai} from '@/ai/genkit';

const requestPayoutFlow = ai.defineFlow(
  {
    name: 'requestPayout',
    inputSchema: z.object({
      accountNumber: z.string(),
      ifscCode: z.string(),
      userId: z.string(),
      userName: z.string().nullable(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
  async (input) => {
    try {
      await addDoc(collection(db, 'payout_requests'), {
        userId: input.userId,
        userName: input.userName,
        accountNumber: input.accountNumber,
        ifscCode: input.ifscCode,
        status: 'pending',
        requestedAt: serverTimestamp(),
      });

      return {
        success: true,
        message: 'Payout request submitted successfully.',
      };
    } catch (error) {
      console.error('Error submitting payout request:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      return {
        success: false,
        message: `Failed to submit payout request: ${errorMessage}`,
      };
    }
  }
);

export async function requestPayout(input: z.infer<typeof requestPayoutFlow.inputSchema>) {
    return requestPayoutFlow(input);
}
