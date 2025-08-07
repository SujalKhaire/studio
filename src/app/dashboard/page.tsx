'use client';

import React, from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UploadItineraryForm } from '@/components/upload-itinerary-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isUploadDialogOpen, setUploadDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // This is a simplified dashboard view. A real app would have the multi-step verification here.
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Creator Dashboard</h1>
        <Dialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>Upload Itinerary</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Itinerary</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new itinerary to your profile.
              </DialogDescription>
            </DialogHeader>
            <UploadItineraryForm userId={user.uid} onUploadSuccess={() => setUploadDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle>Earnings & Payouts</CardTitle>
                <CardDescription>Request your earnings.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold font-headline">$0.00</p>
                 <p className="text-xs text-muted-foreground">Total earnings (simulated)</p>
                <Button asChild className="mt-4">
                    <Link href="/dashboard/payout">Request Payout</Link>
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Your Itineraries</CardTitle>
                <CardDescription>Manage your uploaded itineraries.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>You have 0 active itineraries.</p>
                <p className="text-xs text-muted-foreground">(This is a placeholder, fetching is not implemented here)</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
