import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./test/e2e",
	outputDir: "./test/results",
	snapshotDir: "./test/snapshots",

	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,

	reporter: [["html", { outputFolder: "test/report" }]],

	use: {
		baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
		extraHTTPHeaders: {
			"x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "",
		},
		trace: "on-first-retry",
		video: "on-first-retry",
		screenshot: "only-on-failure",
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],

	webServer: process.env.PLAYWRIGHT_BASE_URL
		? undefined
		: {
				command: "bun run dev",
				url: "http://localhost:3000",
				reuseExistingServer: !process.env.CI,
				timeout: 120000,
			},
});
