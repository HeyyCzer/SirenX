// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: "https://9a4df7725d1d78c509abfe59e64196b9@sentry.heyyczer.com/2",

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: 0.1,
	// Set profilesSampleRate to 1.0 to profile every transaction.
	// Since profilesSampleRate is relative to tracesSampleRate,
	// the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
	// For example, a tracesSampleRate of 0.5 and profilesSampleRate of 0.5 would
	// results in 25% of transactions being profiled (0.5*0.5=0.25)
	profilesSampleRate: 1.0,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,

	replaysOnErrorSampleRate: 1.0,

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.01,

	// You can remove this option if you're not planning to use the Sentry Session Replay feature:
	integrations: [
		Sentry.replayIntegration({
			maskAllText: false,
			blockAllMedia: false,
		}),
		Sentry.browserProfilingIntegration(),
		Sentry.browserTracingIntegration(),
	],
});
