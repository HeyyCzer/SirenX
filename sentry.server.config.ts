// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: "https://adfe0823652a89aa021901c6d0255c99@o4511109215485952.ingest.us.sentry.io/4511299115548672",

	// Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
	tracesSampleRate: 0.1,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
});
