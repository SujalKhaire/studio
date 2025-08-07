
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, UploadCloud, UserPlus, AppWindow, Smartphone, MapPin, CircleCheckBig, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-b from-primary/5 via-background to-background pt-24 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)_/_0.1),rgba(255,255,255,0))] -z-10"></div>
        <div className="absolute inset-0 -z-20 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary blur-3xl opacity-30 animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-accent blur-3xl opacity-20 animate-float-delay"></div>
        </div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container mx-auto px-4 text-center"
        >
          <motion.div variants={fadeIn} className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <span className="text-sm font-medium text-primary flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" /> Turn your travel expertise into income
            </span>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="font-headline text-4xl font-black tracking-tight md:text-6xl lg:text-7xl text-glow bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/90">
            Monetize Your <span className="relative inline-block">Wanderlust
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent" viewBox="0 0 200 20">
                <path d="M0,10 Q100,25 200,10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Join Ziravo, the exclusive marketplace where travel creators sell unique itineraries to a global audience of adventurers.
          </motion.p>
          
          <motion.div variants={fadeIn} className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" className="rounded-full font-bold text-base group w-full sm:w-auto" asChild>
              <Link href="/register">
                Start Selling Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full font-bold text-base hover:bg-primary/10 w-full sm:w-auto" asChild>
              <Link href="/#how-it-works">Learn More</Link>
            </Button>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            className="mt-16 mx-auto max-w-4xl relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-lg -z-10"></div>
            <div className="relative rounded-2xl overflow-hidden border border-border/20 shadow-2xl shadow-primary/10">
              <Image
                src="https://placehold.co/1280x720.png"
                alt="Traveler using Ziravo app"
                data-ai-hint="travel planning map"
                width={1280}
                height={720}
                className="w-full h-auto"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent"></div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Ziravo App Section */}
      <section className="w-full py-20 md:py-28 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-headline text-3xl font-bold md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
              The Ziravo App Experience
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our mobile app is where the magic happens. Travelers browse and purchase itineraries, making it the ultimate tool for modern exploration.
            </p>
            <ul className="mt-8 space-y-6">
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-start p-4 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <div className="bg-primary/10 p-2 rounded-lg mr-4">
                  <CircleCheckBig className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Discover Unique Trips</h3>
                  <p className="text-muted-foreground">Access a curated marketplace of itineraries from trusted travel experts.</p>
                </div>
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex items-start p-4 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <div className="bg-primary/10 p-2 rounded-lg mr-4">
                  <CircleCheckBig className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Seamless In-App Purchases</h3>
                  <p className="text-muted-foreground">Easy, secure transactions for all itineraries right within the app.</p>
                </div>
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex items-start p-4 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <div className="bg-primary/10 p-2 rounded-lg mr-4">
                  <CircleCheckBig className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Offline Access Anywhere</h3>
                  <p className="text-muted-foreground">Download itineraries and access them on the go, even without an internet connection.</p>
                </div>
              </motion.li>
            </ul>
            <div className="mt-10 flex items-center gap-4">
              <Button variant="outline" size="lg" className="rounded-full font-semibold hover:bg-primary/5">
                <AppWindow className="mr-2 h-5 w-5" /> Google Play
              </Button>
              <Button variant="outline" size="lg" className="rounded-full font-semibold hover:bg-primary/5">
                <Smartphone className="mr-2 h-5 w-5" /> App Store
              </Button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center relative"
          >
            <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl -z-10"></div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-lg -z-10"></div>
              <div className="relative -rotate-3 transform transition-transform hover:rotate-0 hover:scale-105 duration-300">
                <Image
                  src="https://placehold.co/350x525.png"
                  alt="Ziravo App on a smartphone"
                  data-ai-hint="phone mockup travel"
                  width={350}
                  height={525}
                  className="rounded-2xl shadow-2xl ring-4 ring-border/20"
                />
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(0,0,0,0.1)] pointer-events-none"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="w-full py-20 md:py-28 bg-background" ref={sectionRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2 variants={fadeIn} className="font-headline text-3xl font-bold md:text-4xl">
              Your Journey to Earning, <span className="text-primary">Simplified</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              We provide the tools, you provide the expertise. Start selling in just three simple steps.
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={staggerContainer}
            className="mt-16 grid gap-8 md:grid-cols-3"
          >
            <motion.div variants={fadeIn}>
              <Card className="text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-primary/20 h-full group">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <UserPlus className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4 text-2xl">1. Join the Collective</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Sign up as a Ziravo creator. It's fast, free, and your first step to a new revenue stream.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Card className="text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-primary/20 h-full group">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <UploadCloud className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4 text-2xl">2. Share Your Genius</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Upload your best travel itineraries as links. Our platform makes them available in our mobile app.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Card className="text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-primary/20 h-full group">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4 text-2xl">3. Reach the World</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Once approved, your itinerary is live on the Ziravo app, ready for travelers to purchase and explore.</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Test Payments Section */}
      <section className="w-full py-12 bg-muted/40">
        <div className="container mx-auto px-4 text-center">
            <h3 className="font-headline text-2xl font-bold">Test the Platform</h3>
            <p className="text-muted-foreground mt-2 mb-6">Click a button to simulate purchasing an itinerary. (You must be logged in)</p>
            <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                    <Link href="/pay?item_id=1">Test Pay for '7-Day Bali Escape' (ID: 1)</Link>
                </Button>
                 <Button asChild size="lg" variant="secondary">
                    <Link href="/pay?item_id=2">Test Pay for 'Kyoto Cherry Blossom Tour' (ID: 2)</Link>
                </Button>
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-20 md:py-28 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-headline text-3xl font-bold md:text-4xl">Why Creators Love Ziravo</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Hear from travel experts about their experience with our platform
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="mt-16 grid gap-8 md:grid-cols-1 lg:grid-cols-2"
          >
            <motion.div variants={fadeIn}>
              <Card className="border-l-4 border-accent shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardContent className="pt-6">
                  <blockquote className="space-y-4">
                    <p className="text-muted-foreground text-lg italic">"The platform makes it so easy to share my travel knowledge. I love how I can focus on creating great content while Ziravo handles the technical side."</p>
                    <footer className="flex items-center space-x-4 pt-2">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="female portrait" alt="Alexa T." />
                        <AvatarFallback>AT</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-lg">Alexa T.</p>
                        <p className="text-sm text-muted-foreground">Travel Blogger</p>
                      </div>
                    </footer>
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Card className="border-l-4 border-accent shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardContent className="pt-6">
                  <blockquote className="space-y-4">
                    <p className="text-muted-foreground text-lg italic">"As a photographer, I appreciate how Ziravo lets me share the stories behind my images. It's a perfect complement to my visual work."</p>
                    <footer className="flex items-center space-x-4 pt-2">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="male portrait" alt="Mario E." />
                        <AvatarFallback>ME</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-lg">Mario E.</p>
                        <p className="text-sm text-muted-foreground">Adventure Photographer</p>
                      </div>
                    </footer>
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 md:py-28 bg-gradient-to-t from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-headline text-3xl font-bold md:text-4xl">Ready to Share Your Travel Expertise?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join our growing community of travel creators and start monetizing your knowledge today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" className="rounded-full font-bold text-base group w-full sm:w-auto" asChild>
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

    