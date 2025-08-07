# **App Name**: Wanderlust Monetizer

## Core Features:

- Homepage Design: Visually appealing, responsive homepage with a hero section, 'How It Works' cards, an 'About' section, and testimonial cards.
- Upload Itinerary Form: A reusable component that lets the user enter Title, a public link to the itinerary document, and Price.
- Upload Itinerary Flow: Server flow to add a new itinerary to Firestore with a sequential ID and 'Draft' status, using the public link.
- Payout Request Page: Request payout form that lets creators enter their bank account number and IFSC code for payouts, triggering a payout request flow.
- Request Payout Flow: Flow that saves user's payout request details (bank account, IFSC) into a payout_requests collection in Firestore for manual processing.
- Payment Page: Payment Page to fetch and display itinerary details, and simulate a successful payment with redirect to success page
- Payment Success Page: Show simple text and layout that shows and acknowledges a successful, but simulated payment.

## Style Guidelines:

- Primary color: A vibrant blue (#2563eb) to reflect the energy of exploration. It stands out against the light background but is not overwhelming.
- Background color: Light grey (#f2f2f2), a subtle tint of the primary hue that maintains a clean, modern aesthetic and complements the analogous palette. It offers sufficient contrast to the other elements.
- Accent color: A turquoise tone (#45c4b0) that is close to the primary color, adding freshness without overpowering it. This works very well with calls to action.
- Headline font: 'Space Grotesk' (sans-serif) for headlines to maintain a contemporary, precise feel.
- Body font: 'PT Sans' (sans-serif) for body text for better readability in longer text blocks.
- Simple, outline-style icons from Lucide to represent features and navigation items.
- Clean and modern layout with generous spacing. Hero section at the top followed by clear sections for content.