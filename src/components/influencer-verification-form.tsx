"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Bot, KeyRound, Loader2 } from "lucide-react";
import { processApplication } from "@/ai/flows/process-application";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('A valid email is required.'),
  socialLinks: z.string().min(3, 'Social link is required.'),
  verificationCode: z.string().length(6, 'Verification code must be 6 characters.'),
  confirm: z.boolean().refine((val) => val === true, {
    message: "You must confirm you have sent the code.",
  }),
});

// Helper function to generate a random code
const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};


export default function InfluencerVerificationForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use state to manage the code to avoid hydration mismatches
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  useEffect(() => {
    setVerificationCode(generateCode());
  }, [])


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.displayName || "",
      email: user?.email || "",
      socialLinks: "",
      verificationCode: "",
      confirm: false,
    },
  });

  useEffect(() => {
    if(user) {
        form.setValue("fullName", user.displayName || "");
        form.setValue("email", user.email || "");
    }
    if (verificationCode) {
        form.setValue("verificationCode", verificationCode);
    }
  }, [user, verificationCode, form]);
  
  if (!user || !verificationCode) {
    return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to submit.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      await processApplication({
        userId: user.uid,
        ...values,
      });
      // The onSnapshot listener on the dashboard page will handle the UI update
      // so we don't need to navigate or set state here.
      toast({
        title: "Application Submitted!",
        description: "We've received your request. We'll review it and notify you via email.",
      });

    } catch (error: any) {
      console.error("Verification submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
      });
    } finally {
        setIsProcessing(false);
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 flex justify-center">
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Bot className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl text-center">Creator Verification</CardTitle>
        <CardDescription className="text-center">
          Complete the two steps below to apply for a creator account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           <fieldset disabled={isProcessing} className="space-y-6">
            
            <Alert>
                <KeyRound className="h-4 w-4"/>
                <AlertTitle className="font-bold">
                    Step 1: Verify Your Social Account
                </AlertTitle>
                <AlertDescription className="space-y-3">
                   <p>To prove you own your social media account, send us a Direct Message (DM) from the account you listed in the form.</p>
                   <p>Your unique verification code is:</p>
                   <div className="flex justify-center">
                    <div className="text-2xl font-bold tracking-widest bg-muted text-foreground rounded-md px-4 py-2 my-2 inline-block">
                        {verificationCode}
                    </div>
                   </div>
                   <p>DM this code to our <a href="https://instagram.com/ziravo" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-primary">@Ziravo Instagram account</a>. We'll check for your message after you submit this form.</p>
                </AlertDescription>
            </Alert>

            <div>
                <h3 className="text-lg font-semibold mb-4">Step 2: Submit Your Application</h3>
                <div className="space-y-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input placeholder="name@example.com" {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    
                    <FormField
                    control={form.control}
                    name="socialLinks"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Primary Social Media Link</FormLabel>
                        <FormControl>
                            <Textarea placeholder="e.g., instagram.com/username" {...field} rows={2} />
                        </FormControl>
                        <FormDescription>
                            The account you will DM us from.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    {/* Hidden field for verificationCode */}
                    <FormField
                      control={form.control}
                      name="verificationCode"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormLabel>Verification Code</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                    control={form.control}
                    name="confirm"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            I have sent the code and confirm the information above is accurate.
                            </FormLabel>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </div>

            
            </fieldset>

            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isProcessing ? "Submitting Application..." : "Submit Application"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
    </div>
  );
}
