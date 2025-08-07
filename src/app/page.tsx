'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Palette, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Monetize Your Wanderlust
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join the Wanderlust Monetizer creator hub. Share your travel itineraries and earn from your passion. We handle the rest.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Start Selling <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="#how-it-works">Learn More</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="travel flatlay"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A Simple Path to Profit</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We've streamlined the process so you can focus on what you do best: creating amazing travel experiences.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              {[
                { icon: Rocket, title: 'Join the Collective', description: 'Sign up and get verified as a Wanderlust Monetizer creator. It’s quick, easy, and free.' },
                { icon: Palette, title: 'Share Your Genius', description: 'Upload your unique travel itineraries. Add details, pricing, and a public link to your guide.' },
                { icon: Globe, title: 'Reach the World', description: 'We showcase your itineraries to a global audience of eager travelers through our app.' },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeIn}
                  custom={index}
                  transition={{ delay: index * 0.2 }}
                  className="grid gap-1"
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="bg-primary text-primary-foreground rounded-full p-3">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="font-headline">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About App Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container mx-auto grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <motion.div
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Meet the Wanderlust Monetizer App</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our consumer-facing mobile app is where the magic happens. Travelers can discover, purchase, and use your itineraries for their next adventure.
                </p>
              </div>
              <ul className="grid gap-2 py-4">
                <li>✓ Instant access to purchased guides</li>
                <li>✓ Seamless one-tap payments</li>
                <li>✓ Creator profiles to follow your work</li>
              </ul>
              <div className="flex gap-2">
                <Image src="https://placehold.co/120x40.png" width={120} height={40} alt="App Store" data-ai-hint="app store" />
                <Image src="https://placehold.co/120x40.png" width={120} height={40} alt="Google Play" data-ai-hint="play store" />
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <Image
                src="https://placehold.co/550x550.png"
                width="550"
                height="550"
                alt="App"
                data-ai-hint="phone mockup travel"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full"
              />
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Trusted by Creators</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear what our creators have to say about their journey with us.
              </p>
            </motion.div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 mt-12">
              {[
                { name: 'Alex T.', role: 'Travel Blogger', avatar: 'AT', image: 'https://placehold.co/50x50.png', text: 'Wanderlust Monetizer transformed my side-hustle. I was already creating itineraries for my followers, now I get paid for it effortlessly.' },
                { name: 'Maria S.', role: 'Van Life Influencer', avatar: 'MS', image: 'https://placehold.co/50x50.png', text: 'The platform is super intuitive. Uploading my road trip guides was a breeze, and I saw my first sale within a week!' },
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeIn}
                  custom={index}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-lg">"{testimonial.text}"</p>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={testimonial.image} data-ai-hint="person portrait" />
                          <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <motion.div
              className="space-y-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Ready to Start Your Journey?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Turn your travel expertise into a recurring income stream. Join our community of creators today.
              </p>
            </motion.div>
            <motion.div
              className="mx-auto w-full max-w-sm space-y-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              <Button asChild size="lg" className="w-full">
                <Link href="/register">
                  Sign Up for Free
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
