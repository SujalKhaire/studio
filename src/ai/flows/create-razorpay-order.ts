'use server';
/**
 * @fileOverview A flow to create a Razorpay order.
 * - createRazorpayOrder - Creates an order on Razorpay and returns the order details.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import Razorpay from 'razorpay';
import { GenkitError } from 'genkit';

const CreateRazorpayOrderInputSchema = z.object({
  amount: z.number().positive('Amount must be positive.'),
  currency: z.string().length(3, 'Currency must be a 3-letter code.'),
});

const CreateRazorpayOrderOutputSchema = z.object({
  id: z.string(),
  entity: z.string(),
  amount: z.number(),
  amount_paid: z.number(),
  amount_due: z.number(),
  currency: z.string(),
  receipt: z.string().nullable(),
  offer_id: z.string().nullable(),
  status: z.string(),
  attempts: z.number(),
  notes: z.record(z.string()),
  created_at: z.number(),
});

const createRazorpayOrderFlow = ai.defineFlow(
  {
    name: 'createRazorpayOrderFlow',
    inputSchema: CreateRazorpayOrderInputSchema,
    outputSchema: CreateRazorpayOrderOutputSchema,
  },
  async (payload) => {
    const { amount, currency } = payload;
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new GenkitError({
        status: 'FAILED_PRECONDITION',
        message: 'Razorpay API keys are not configured in environment variables.',
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount,
      currency,
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      return order;
    } catch (error: any) {
      console.error('Razorpay order creation failed:', error);
      throw new GenkitError({
        status: 'INTERNAL',
        message: `Failed to create Razorpay order: ${error.message || 'Unknown error'}`,
      });
    }
  }
);

export async function createRazorpayOrder(
  input: z.infer<typeof CreateRazorpayOrderInputSchema>
): Promise<z.infer<typeof CreateRazorpayOrderOutputSchema>> {
  return createRazorpayOrderFlow(input);
}
