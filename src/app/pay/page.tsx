'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createRazorpayOrder } from '@/ai/flows/create-razorpay-order';
import Script from 'next/script';
import { databases } from '@/lib/appwrite';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Itinerary {
  id: string;
  title: string;
  price: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const DATABASE_ID = '685cf1920027a207852a';
const COLLECTION_ID_PURCHASES = '685eba5a000243ee4df0';

function PayPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const itemId = searchParams.get('item_id');
  const userId = searchParams.get('uid');

  const [itinerary, setItinerary] = React.useState<Itinerary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchItinerary() {
      if (!itemId || !userId) {
        setError('Missing itinerary or user ID.');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'itineraries', itemId);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
          throw new Error('Itinerary not found.');
        }

        const data = snapshot.data();
        setItinerary({
          id: snapshot.id,
          title: data.title,
          price: data.price,
        });
      } catch (err) {
        console.error('Firebase error:', err);
        setError('Failed to load itinerary.');
      } finally {
        setLoading(false);
      }
    }

    fetchItinerary();
  }, [itemId, userId]);

  const handlePaymentSuccess = async (paymentResponse: any) => {
    if (!itinerary || !userId) return;

    try {
      const numericItemId = parseInt(itinerary.id);

      if (isNaN(numericItemId)) {
        throw new Error('Invalid itemId: must be a number for Appwrite.');
      }

      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID_PURCHASES,
        'unique()',
        {
          itemId: numericItemId,
          uid: userId,
          paymentid: paymentResponse.razorpay_payment_id,
        }
      );

      console.log("✅ Stored payment success in Appwrite.");
    } catch (error) {
      console.error('Appwrite store error:', error);
      toast({
        variant: 'destructive',
        title: 'Appwrite Error',
        description: (error as Error).message,
      });
    }
     const redirectUrl = "yourapp://payment_success?uid=${userId}&item_id=${itinerary.id}&payment_id=${paymentResponse.razorpay_payment_id}";
    window.location.href = redirectUrl;

    setTimeout(() => {
      router.push("/payment-success?item_id=${itinerary.id}");
    }, 2000);
  };

  const handlePayment = async () => {
    if (!itinerary || !userId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Missing itinerary or user ID.',
      });
      return;
    }

    setProcessing(true);

    try {
      const order = await createRazorpayOrder({
        amount: itinerary.price * 100,
        currency: 'INR',
      });

      if (!order?.id) {
        throw new Error('Failed to create Razorpay order.');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Ziravo',
        description: `Payment for ${itinerary.title}`,
        order_id: order.id,
        handler: (response: any) => handlePaymentSuccess(response),
        prefill: {
          name: 'Ziravo User',
          email: '',
        },
        notes: {
          itineraryId: itinerary.id,
          userId,
        },
        theme: {
          color: '#2563eb',
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        toast({
          variant: 'destructive',
          title: 'Payment Failed',
          description: `Code: ${response.error.code}. ${response.error.description}`,
        });
        setProcessing(false);
      });

      rzp.open();
    } catch (e: any) {
      console.error('Payment initiation error:', e);
      toast({
        variant: 'destructive',
        title: 'Payment Error',
        description: e.message || 'Failed to initiate payment.',
      });
      setProcessing(false);
    }
  };

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Complete Your Purchase</CardTitle>
            <CardDescription>You're one step away from your next adventure.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-12 w-full" />
              </div>
            )}
            {error && (
              <div className="text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}
            {!loading && !error && itinerary && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{itinerary.title}</h3>
                  <p className="text-sm text-muted-foreground">Digital Itinerary Guide</p>
                </div>
                <div className="text-4xl font-bold font-headline text-primary">
                  ₹{itinerary.price.toFixed(2)}
                </div>
                <Button onClick={handlePayment} className="w-full" size="lg" disabled={processing || !userId}>
                  {processing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="mr-2 h-5 w-5" />
                  )}
                  {processing ? 'Processing...' : 'Pay with Razorpay'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function PayPage() {
  return (
    <React.Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <PayPageContent />
    </React.Suspense>
  );
}
