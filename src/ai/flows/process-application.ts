'use server';

/**
 * @fileOverview A flow to handle creator verification applications.
 *
 * - processApplication - Saves a creator's application to Firestore for manual review.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ProcessApplicationInputSchema = z.object({
  userId: z.string().describe('The Firebase Auth UID of the user.'),
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('A valid email is required.'),
  socialLinks: z.string().min(3, 'Social link is required.'),
  verificationCode: z.string().length(6, 'Verification code must be 6 characters.'),
});
type ProcessApplicationInput = z.infer<typeof ProcessApplicationInputSchema>;

const ProcessApplicationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
type ProcessApplicationOutput = z.infer<typeof ProcessApplicationOutputSchema>;

const processApplicationFlow = ai.defineFlow(
  {
    name: 'processApplicationFlow',
    inputSchema: ProcessApplicationInputSchema,
    outputSchema: ProcessApplicationOutputSchema,
  },
  async (payload) => {
    try {
      const applicationRef = doc(db, 'influencer_requests', payload.userId);

      await setDoc(applicationRef, {
        userId: payload.userId,
        fullName: payload.fullName,
        email: payload.email,
        instagramHandle: payload.socialLinks, // Re-using old field to match dashboard
        verificationCode: payload.verificationCode,
        status: 'pending',
        submittedAt: serverTimestamp(),
      });

      return {
        success: true,
        message: 'Application submitted successfully.',
      };
    } catch (error) {
      console.error('Error processing application:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      // It's better to throw the error to be caught by the client-side try/catch block
      throw new Error(`Failed to submit application: ${errorMessage}`);
    }
  }
);

export async function processApplication(input: ProcessApplicationInput): Promise<ProcessApplicationOutput> {
  return await processApplicationFlow(input);
}
