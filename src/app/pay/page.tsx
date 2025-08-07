'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs, runTransaction, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { createRazorpayOrder } from '@/ai/flows/create-razorpay-order';
import Script from 'next/script';

interface Itinerary {
  id: string; // Document ID
  title: string;
  price: number;
  creatorId: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

function PayPageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const itemId = searchParams.get('item_id');

  const [itinerary, setItinerary] = React.useState<Itinerary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchItinerary() {
      if (!itemId) {
        setError('No item ID provided.');
        setLoading(false);
        return;
      }

      try {
        const itinerariesRef = collection(db, 'itineraries');
        const q = query(itinerariesRef, where('id', '==', itemId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('Itinerary not found.');
        } else {
          const doc = querySnapshot.docs[0];
          const docData = doc.data();
          setItinerary({
            id: doc.id,
            title: docData.title,
            price: docData.price,
            creatorId: docData.userId,
          });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch itinerary details.');
      } finally {
        setLoading(false);
      }
    }

    fetchItinerary();
  }, [itemId]);

  const handlePaymentSuccess = async () => {
    if (!itinerary) return;

    try {
        const itineraryRef = doc(db, 'itineraries', itinerary.id);
        
        await runTransaction(db, async (transaction) => {
          const itineraryDoc = await transaction.get(itineraryRef);
          if (!itineraryDoc.exists()) {
            throw "Document does not exist!";
          }
  
          const newSales = (itineraryDoc.data().sales || 0) + 1;
          const newEarnings = (itineraryDoc.data().earnings || 0) + itineraryDoc.data().price;
          
          transaction.update(itineraryRef, { 
            sales: newSales,
            earnings: newEarnings 
          });
        });
  
        router.push('/payment-success');
      } catch (e) {
        console.error("Transaction failed: ", e);
        toast({
          variant: 'destructive',
          title: "Database Update Failed",
          description: "Your payment was successful, but we couldn't update your purchase. Please contact support."
        });
      }
  }


  const handlePayment = async () => {
    if (!itinerary || !user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to pay.'})
        return;
    };
    setProcessing(true);

    try {
        const order = await createRazorpayOrder({
            amount: itinerary.price * 100, // Amount in paise
            currency: 'INR',
        });

        if (!order || !order.id) {
            throw new Error('Could not create Razorpay order.');
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Ziravo",
            description: `Payment for ${itinerary.title}`,
            order_id: order.id,
            handler: async (response: any) => {
                // For this example, we'll assume payment is successful on handler callback.
                // In a production app, you should verify the payment signature on your backend.
                await handlePaymentSuccess();
            },
            prefill: {
                name: user.displayName || 'Ziravo User',
                email: user.email,
            },
            notes: {
                itineraryId: itinerary.id,
                userId: user.uid,
            },
            theme: {
                color: "#2563eb"
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch(e: any) {
        console.error("Payment failed", e);
        toast({
            variant: 'destructive',
            title: 'Payment Failed',
            description: e.message || "Could not process your payment. Please try again."
        })
    } finally {
        setProcessing(false);
    }
  };

  return (
    <>
    <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
    />
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
              <Button onClick={handlePayment} className="w-full" size="lg" disabled={processing || !user}>
                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CreditCard className="mr-2 h-5 w-5" />}
                {processing ? "Processing..." : "Pay with Razorpay"}
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
        <React.Suspense fallback={<div>Loading...</div>}>
            <PayPageContent />
        </React.Suspense>
    )
}
