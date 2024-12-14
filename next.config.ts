import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.buymeacoffee.com",
			},
		],
	},
};

export default nextConfig;