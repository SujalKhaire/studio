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
import { useToast } from '@/hooks/use-toast';
import { uploadItinerary } from '@/ai/flows/upload-itinerary';
import { Loader2, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  itineraryLink: z.string().url({ message: 'Please enter a valid URL.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
});

type UploadItineraryFormValues = z.infer<typeof formSchema>;

interface UploadItineraryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadItineraryForm({ open, onOpenChange }: UploadItineraryFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<UploadItineraryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      itineraryLink: '',
      price: 0,
    },
  });

  async function onSubmit(data: UploadItineraryFormValues) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to upload an itinerary.',
      });
      return;
    }
    
    setIsSubmitting(true);
    const result = await uploadItinerary({
      title: data.title,
      itineraryLink: data.itineraryLink,
      price: data.price,
      userId: user.uid,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Success!',
        description: 'Your itinerary has been uploaded successfully.',
      });
      form.reset();
      onOpenChange(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: result.message,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" /> Add New Itinerary
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new itinerary to the marketplace.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <fieldset disabled={isSubmitting} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Itinerary Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 7-Day Bali Escape" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="itineraryLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Itinerary Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://docs.google.com/document/d/..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a public, shareable link (e.g., Google Docs, Notion).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (INR)</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" placeholder="1599" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Submit Itinerary'}
            </Button>
          </form>
        </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
