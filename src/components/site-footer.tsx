import Link from 'next/link';
import { Twitter, Instagram, Facebook } from 'lucide-react';
import { Button } from './ui/button';

export default function SiteFooter() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <Link href="/" className="text-xl font-bold font-headline">
            Ziravo
          </Link>

          <div className="mt-4 flex sm:mt-0">
            <Link href="#" className="px-4 text-sm hover:underline">Contact</Link>
            <Link href="#" className="px-4 text-sm hover:underline">Terms</Link>
            <Link href="#" className="px-4 text-sm hover:underline">Privacy</Link>
          </div>
        </div>

        <hr className="my-6 border-border" />

        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Ziravo. All Rights Reserved.</p>

          <div className="-mx-2 mt-3 flex sm:mt-0">
            <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Twitter">
                    <Twitter className="h-5 w-5" />
                </a>
            </Button>
             <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Instagram">
                    <Instagram className="h-5 w-5" />
                </a>
            </Button>
             <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Facebook">
                    <Facebook className="h-5 w-5" />
                </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
