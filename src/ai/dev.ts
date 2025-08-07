import { nextDev } from '@genkit-ai/next';

// This will discover and register all flows and other assets.
import './genkit';

nextDev({
  port: 3400, // The port to run the Genkit development server on
});
