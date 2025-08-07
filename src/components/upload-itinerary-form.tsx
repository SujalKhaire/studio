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
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  publicLink: z.string().url({ message: 'Please enter a valid URL.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
});

type UploadItineraryFormValues = z.infer<typeof formSchema>;

interface UploadItineraryFormProps {
  userId: string;
  onUploadSuccess?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadItineraryForm({ userId, onUploadSuccess, open, onOpenChange }: UploadItineraryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<UploadItineraryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      publicLink: '',
      price: 0,
    },
  });

  async function onSubmit(data: UploadItineraryFormValues) {
    setIsSubmitting(true);
    const result = await uploadItinerary({
      ...data,
      creatorId: userId,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Success!',
        description: 'Your itinerary has been uploaded successfully.',
      });
      form.reset();
      onUploadSuccess?.();
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload New Itinerary</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new itinerary to your profile.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Itinerary Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 7 Days in Bali" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publicLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormDescription>
                    A public link to your itinerary (e.g., Google Doc, Notion page).
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
                    <Input type="number" placeholder="500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload Itinerary
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
