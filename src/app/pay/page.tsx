
'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { createRazorpayOrder } from '@/ai/flows/create-razorpay-order';
import Script from 'next/script';
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
            const itineraryRef = doc(db, 'itineraries', itemId);
            const docSnap = await getDoc(itineraryRef);
    
            if (docSnap.exists()) {
              const data = docSnap.data();
              setItinerary({
                id: docSnap.id,
                title: data.title,
                price: data.price,
              });
            } else {
              setError('Itinerary not found.');
            }
        } catch (err) {
            console.error("Error fetching itinerary:", err);
            setError('Failed to load itinerary details.');
        } finally {
            setLoading(false);
        }
    }
    fetchItinerary();
  }, [itemId]);

  const handlePaymentSuccess = (paymentResponse: any) => {
    if (!itinerary) return;

    // Redirect to the custom Android app URL scheme.
    const redirectUrl = `yourapp://payment_success?item_id=${itinerary.id}&payment_id=${paymentResponse.razorpay_payment_id}`;
    window.location.href = redirectUrl;

    // As a fallback, you can also redirect to a web success page after a delay
    // in case the app redirect doesn't work.
    setTimeout(() => {
        router.push(`/payment-success?item_id=${itinerary.id}`);
    }, 2000);
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
            handler: (response: any) => {
                handlePaymentSuccess(response);
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

        rzp.on('payment.failed', function (response: any) {
            console.error('Razorpay payment failed:', response.error);
            toast({
                variant: 'destructive',
                title: 'Payment Failed',
                description: `Code: ${response.error.code}. ${response.error.description}`,
            });
            // Optionally redirect to a failure page
            // router.push('/payment-failed');
            setProcessing(false);
        });

        rzp.open();

    } catch(e: any) {
        console.error("Payment initiation failed", e);
        toast({
            variant: 'destructive',
            title: 'Payment Error',
            description: e.message || "Could not process your payment. Please try again."
        })
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
        <React.Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <PayPageContent />
        </React.Suspense>
    )
}
