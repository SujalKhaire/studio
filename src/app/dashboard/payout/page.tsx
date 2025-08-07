'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { requestPayout } from '@/ai/flows/request-payout';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const payoutFormSchema = z.object({
  accountNumber: z.string().min(8, { message: 'Account number must be at least 8 digits.' }),
  ifscCode: z.string().length(11, { message: 'IFSC code must be 11 characters.' }),
});

type PayoutFormValues = z.infer<typeof payoutFormSchema>;

export default function PayoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<PayoutFormValues>({
    resolver: zodResolver(payoutFormSchema),
    defaultValues: {
      accountNumber: '',
      ifscCode: '',
    },
  });

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  async function onSubmit(data: PayoutFormValues) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to request a payout.',
      });
      return;
    }
    
    setIsSubmitting(true);
    const result = await requestPayout({
      ...data,
      userId: user.uid,
      userName: user.displayName,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Your payout request has been submitted.',
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Request Payout</CardTitle>
          <CardDescription>
            Enter your bank details to receive your earnings. Payouts are processed manually within 5-7 business days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your account number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ifscCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your bank's IFSC code" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is an 11-character code used for bank transfers in India.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Payout Request
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
