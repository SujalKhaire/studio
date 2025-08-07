import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto py-20 px-4 flex justify-center items-center">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-4 w-fit">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="font-headline text-3xl mt-4">Payment Successful!</CardTitle>
          <CardDescription>
            Your transaction has been completed. Your itinerary is now available. (This is a simulation).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            In a real application, you would receive an email with a link to your purchased itinerary.
          </p>
          <Button asChild>
            <Link href="/">Return to Homepage</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
