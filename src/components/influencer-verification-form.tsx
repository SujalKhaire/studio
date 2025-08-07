
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const verificationFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  instagramHandle: z.string().min(3, 'Instagram handle is required.'),
  bio: z.string().min(50, 'Bio must be at least 50 characters.').max(500, 'Bio cannot exceed 500 characters.'),
});

type VerificationFormValues = z.infer<typeof verificationFormSchema>;

export default function InfluencerVerificationForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      fullName: '',
      instagramHandle: '',
      bio: '',
    },
  });

  async function onSubmit(data: VerificationFormValues) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const requestRef = doc(db, 'influencer_requests', user.uid);
      await setDoc(requestRef, {
        ...data,
        userId: user.uid,
        email: user.email,
        status: 'pending',
        submittedAt: serverTimestamp(),
      });
      toast({
        title: 'Application Submitted',
        description: "We've received your verification request. We'll review it and get back to you soon.",
      });
    } catch (error) {
      console.error('Error submitting verification form: ', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Become a Verified Creator</CardTitle>
          <CardDescription>
            Complete this application to get verified. This helps us maintain a high-quality community of travel experts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagramHandle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Handle</FormLabel>
                    <FormControl>
                      <Input placeholder="@yourhandle" {...field} />
                    </FormControl>
                    <FormDescription>Your primary social media handle for verification.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Creator Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your travel style, expertise, and what kind of itineraries you create..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                        This will be displayed on your public profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Verification
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
