'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CreditCard } from 'lucide-react';

interface Itinerary {
  id: string;
  title: string;
  price: number;
  creatorId: string;
}

function PayPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const itemId = searchParams.get('item_id');

  const [itinerary, setItinerary] = React.useState<Itinerary | null>(null);
  const [loading, setLoading] = React.useState(true);
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
        const q = query(itinerariesRef, where('itineraryId', '==', parseInt(itemId, 10)));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('Itinerary not found.');
        } else {
          const docData = querySnapshot.docs[0].data();
          setItinerary({
            id: querySnapshot.docs[0].id,
            title: docData.title,
            price: docData.price,
            creatorId: docData.creatorId,
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

  const handlePayment = () => {
    // This is a simulation. In a real app, you would integrate a payment gateway.
    router.push('/payment-success');
  };

  return (
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
                ${itinerary.price.toFixed(2)}
              </div>
              <Button onClick={handlePayment} className="w-full" size="lg">
                <CreditCard className="mr-2 h-5 w-5" />
                Pay Now (Simulated)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


export default function PayPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <PayPageContent />
        </React.Suspense>
    )
}
