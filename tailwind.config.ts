import type { Config } from "tailwindcss";
import tailwindCss3d from "tailwindcss-3d";

export default {
	darkMode: "class",
	content: [
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
		extend: {
			animation: {
				siren: "siren 1.5s infinite steps(1)",
				siren2: "siren2 1.5s infinite steps(1)",

				slideDownAndFade: "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideLeftAndFade: "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideRightAndFade: "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
			},
			keyframes: {
				slideDownAndFade: {
					from: { opacity: "0", transform: "translateY(-2px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
				slideLeftAndFade: {
					from: { opacity: "0", transform: "translateX(2px)" },
					to: { opacity: "1", transform: "translateX(0)" },
				},
				slideUpAndFade: {
					from: { opacity: "0", transform: "translateY(2px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
				slideRightAndFade: {
					from: { opacity: "0", transform: "translateX(-2px)" },
					to: { opacity: "1", transform: "translateX(0)" },
				},
			},
		},
	},
	plugins: [
		tailwindCss3d,
		function ({ addBase, theme }: any) {
			function extractColorVars(colorObj: any, colorGroup = "") {
				return Object.keys(colorObj).reduce((vars: any, colorKey: any) => {
					const value = colorObj[colorKey];
					const cssVariable = colorKey === "DEFAULT" ? `--color${colorGroup}` : `--color${colorGroup}-${colorKey}`;

					const newVars: any = typeof value === "string" ? { [cssVariable]: value } : extractColorVars(value, `${colorGroup}-${colorKey}`);

					return { ...vars, ...newVars };
				}, {});
			}

			addBase({
				":root": extractColorVars(theme("colors")),
			});
		},
	],
}  satisfies Config;
