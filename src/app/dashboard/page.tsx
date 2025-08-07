"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { sendEmailVerification } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Clock, CheckCircle, XCircle, Hourglass, MailWarning, RefreshCw, Loader2, User, Verified, Wallet, LineChart, Package, Star, Download, FileText } from 'lucide-react';
import InfluencerVerificationForm from '@/components/influencer-verification-form';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, DocumentData, Timestamp, orderBy } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UploadItineraryForm } from '@/components/upload-itinerary-form';
import Link from 'next/link';

type VerificationStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

export interface Itinerary {
  docId: string;
  id: string;
  title: string;
  status: 'Published' | 'Draft' | 'Rejected';
  sales: number;
  price: number;
  earnings: number;
  createdAt: Timestamp;
}

interface Payout {
  id: string;
  requestedAt: Timestamp; 
  amount: number;
  status: string;
}


function VerificationPending() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lastSentTime) {
      interval = setInterval(() => {
        const secondsPassed = Math.floor((Date.now() - lastSentTime) / 1000);
        const remainingCooldown = Math.max(0, 60 - secondsPassed);
        setCooldown(remainingCooldown);
        if (remainingCooldown === 0) clearInterval(interval);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lastSentTime]);

  const handleResendVerification = async () => {
    if (!user) return;
    setIsSending(true);
    try {
      await sendEmailVerification(user);
      setLastSentTime(Date.now());
      setCooldown(60);
      toast({
        title: "Verification Email Sent",
        description: "We've sent a new verification link to your email address.",
      });
    } catch (error: any) {
      let errorMessage = "Could not send verification email.";
      if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many requests. Please wait before trying again.";
      }
      toast({
        variant: "destructive",
        title: "Error Sending Email",
        description: errorMessage,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 text-center">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400">
            <MailWarning className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline mt-4">Verify Your Email Address</CardTitle>
          <CardDescription>
            We've sent a verification link to <span className="font-semibold">{user?.email}</span>. Click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleResendVerification} disabled={isSending || cooldown > 0} className="w-full">
            {isSending ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <MailWarning className="h-4 w-4 mr-2" />}
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function InfluencerApplicationPending() {
  return (
    <div className="container mx-auto py-10 px-4 text-center">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
            <Hourglass className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline mt-4">Application Pending</CardTitle>
          <CardDescription>
            Your verification request is under review. This usually takes 3-5 business days. We'll notify you via email.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

function InfluencerApplicationRejected() {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <Card className="max-w-lg mx-auto border-destructive">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
              <XCircle className="h-8 w-8" />
            </div>
            <CardTitle className="font-headline mt-4">Application Rejected</CardTitle>
            <CardDescription>
              We're sorry, but your application could not be approved at this time. Please check your email for more details.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
}

const ItineraryStatusBadge = ({ status }: { status: 'Published' | 'Draft' | 'Rejected' }) => {
  const statusConfig = {
    Published: { variant: 'default', icon: <CheckCircle className="h-3.5 w-3.5" />, text: 'Published', className: 'bg-green-600' },
    Draft: { variant: 'secondary', icon: <Clock className="h-3.5 w-3.5" />, text: 'Draft' },
    Rejected: { variant: 'destructive', icon: <XCircle className="h-3.5 w-3.5" />, text: 'Rejected' },
  } as const;
  const config = statusConfig[status] || statusConfig.Draft;

  return (
    <Badge variant={config.variant} className={`capitalize flex items-center gap-2 w-fit ${config.className || ''}`}>
      {config.icon}
      {config.text}
    </Badge>
  );
};

const VerifiedStatusBadge = ({ status }: { status: VerificationStatus }) => {
    const statusConfig = {
      approved: { variant: 'default', icon: <Verified className="h-4 w-4" />, text: 'Approved', className: 'bg-green-600' },
      pending: { variant: 'secondary', icon: <Hourglass className="h-4 w-4" />, text: 'Pending' },
      rejected: { variant: 'destructive', icon: <XCircle className="h-4 w-4" />, text: 'Rejected' },
      not_submitted: { variant: 'outline', icon: <User className="h-4 w-4" />, text: 'Not Submitted' },
    } as const;
    const config = statusConfig[status];
  
    return (
      <Badge variant={config.variant} className={`capitalize flex items-center gap-2 text-sm ${config.className || ''}`}>
        {config.icon}
        {config.text}
      </Badge>
    );
};

const PayoutStatusBadge = ({ status }: { status: string }) => {
    const s = status.toLowerCase();
    let variant: 'default' | 'secondary' | 'destructive' = 'secondary';
    let className = '';
    if (s === 'processed') {
      variant = 'default';
      className = 'bg-green-600';
    } else if (s === 'reversed' || s === 'failed' || s === 'rejected') {
      variant = 'destructive';
    }
  
    return (
      <Badge variant={variant} className={`capitalize ${className}`}>
        {status}
      </Badge>
    );
  };

function CreatorDashboard() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [itineraries, setItineraries] = useState<Itinerary[]>([]);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    useEffect(() => {
      if (!user) return;
  
      const itinerariesQuery = query(collection(db, 'itineraries'), where('userId', '==', user.uid));
      const payoutsQuery = query(collection(db, 'payout_requests'), where('userId', '==', user.uid));
  
      const unsubItineraries = onSnapshot(itinerariesQuery, (querySnapshot) => {
        const itinerariesData = querySnapshot.docs.map(doc => ({
          docId: doc.id,
          ...doc.data()
        })) as Itinerary[];
        setItineraries(itinerariesData);
        setLoading(false);
      }, (error) => {
        console.error("Failed to fetch itineraries:", error);
        toast({
          variant: "destructive", title: "Error", description: "Could not load itineraries."
        });
        setLoading(false);
      });

      const unsubPayouts = onSnapshot(payoutsQuery, (querySnapshot) => {
        const payoutsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Payout[];
        
        const sortedPayouts = payoutsData.sort((a, b) => {
            const dateA = a.requestedAt?.toDate() || new Date(0);
            const dateB = b.requestedAt?.toDate() || new Date(0);
            return dateB.getTime() - dateA.getTime();
        });

        setPayouts(sortedPayouts);
      }, (error) => {
        console.error("Failed to fetch payouts:", error);
        toast({
          variant: "destructive", title: "Error", description: "Could not load payouts."
        });
      });

      return () => {
        unsubItineraries();
        unsubPayouts();
      }
    }, [user, toast]);
  
    const metrics = {
      totalItineraries: itineraries.length,
      totalSales: itineraries.reduce((sum, item) => sum + (item.sales || 0), 0),
      lifetimeEarnings: itineraries.reduce((sum, item) => sum + (item.earnings || 0), 0),
      totalPaidOut: payouts.filter(p => p.status.toLowerCase() === 'processed').reduce((sum, item) => sum + item.amount, 0),
      get walletBalance() {
        return this.lifetimeEarnings - this.totalPaidOut;
      },
      get monthlyEarnings() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        return itineraries.reduce((sum, item) => {
            if (item.createdAt) {
              const itemDate = item.createdAt.toDate();
              if (itemDate >= startOfMonth && itemDate <= now) {
                return sum + (item.earnings || 0);
              }
            }
            return sum;
        }, 0);
      },
    };

    const formatCurrency = (amount: number) => {
        return `₹${amount.toFixed(2)}`;
    }
    
    const userProfileImageUrl = user?.photoURL || `https://api.dicebear.com/8.x/lorelei/svg?seed=${user?.email}`;

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
    { user && <UploadItineraryForm open={isUploadOpen} onOpenChange={setIsUploadOpen} userId={user.uid} onUploadSuccess={() => setIsUploadOpen(false)} /> }
    <div className="flex flex-1 flex-col gap-8 bg-muted/20 p-4 sm:p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-headline font-bold">Creator Dashboard</h1>
        <Button onClick={() => setIsUploadOpen(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Add Itinerary
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* Profile Panel */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-card-foreground/5">
                <CardTitle className="font-headline text-xl">Profile</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
              <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                <AvatarImage src={userProfileImageUrl} alt={user?.displayName || 'Creator'} />
                <AvatarFallback>{user?.displayName?.charAt(0) || 'C'}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{user?.displayName || 'Travel Creator'}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <VerifiedStatusBadge status="approved" />
            </CardContent>
          </Card>

          {/* Earnings & Payouts */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Earnings &amp; Payouts</CardTitle>
              <CardDescription>Your current wallet balance and withdrawal history.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                    <p className="text-sm font-medium text-primary">Wallet Balance (Withdrawable)</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(metrics.walletBalance)}
                    </p>
                </div>
                 <div className="text-sm text-muted-foreground text-center">
                    Lifetime Earnings: {formatCurrency(metrics.lifetimeEarnings)}
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold">Withdrawal History</h4>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payouts.length > 0 ? payouts.map((payout) => (
                                <TableRow key={payout.id}>
                                    <TableCell>{payout.requestedAt.toDate().toLocaleDateString()}</TableCell>
                                    <TableCell><PayoutStatusBadge status={payout.status} /></TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(payout.amount)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">No payout history</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <Button className="w-full" asChild disabled={metrics.walletBalance <= 0}>
                   <Link href="/dashboard/payout">
                     <Download className="mr-2 h-4 w-4" />
                     Request Payout
                   </Link>
                </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Performance Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Itineraries</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalItineraries}</div>
                        <p className="text-xs text-muted-foreground">Uploaded lifetime</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalSales}</div>
                        <p className="text-xs text-muted-foreground">Lifetime sales count</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lifetime Earnings</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(metrics.lifetimeEarnings)}</div>
                         <p className="text-xs text-muted-foreground">All-time earnings</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <LineChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(metrics.monthlyEarnings)}</div>
                         <p className="text-xs text-muted-foreground">Earnings this calendar month</p>
                    </CardContent>
                </Card>
            </div>

          {/* Itinerary Management */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Itinerary Management</CardTitle>
              <CardDescription>A list of your uploaded itineraries.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Sales</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itineraries.length > 0 ? itineraries.map((item) => (
                    <TableRow key={item.docId}>
                      <TableCell className="font-mono text-center">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell><ItineraryStatusBadge status={item.status} /></TableCell>
                      <TableCell className="text-center">{item.sales || 0}</TableCell>
                      <TableCell className="text-right">₹{(item.price || 0).toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{(item.earnings || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">No itineraries uploaded yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}


export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (!user.emailVerified) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'influencer_requests', user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            setVerificationStatus(docSnap.data().status as VerificationStatus);
        } else {
            setVerificationStatus('not_submitted');
        }
        setLoading(false);
    }, (error) => {
        console.error("Error fetching verification status from Firestore:", error);
        setLoading(false);
    });

    return () => unsubscribe();

  }, [user, authLoading, router]);

  if (loading || authLoading || !user) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user.emailVerified) {
    return <VerificationPending />;
  }
  
  if (verificationStatus === 'not_submitted') {
    return <InfluencerVerificationForm />;
  }

  if (verificationStatus === 'pending') {
    return <InfluencerApplicationPending />;
  }

  if (verificationStatus === 'rejected') {
    return <InfluencerApplicationRejected />;
  }
  
  if (verificationStatus === 'approved') {
    return <CreatorDashboard />;
  }

  // Fallback for null status or other loading states
  return (
    <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
