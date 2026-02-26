"use client";

import AboutSection from "@/app/components/AboutSection";
import FeaturesSection from "@/app/components/FeaturesSection";
import Hero from "@/app/components/Hero";
import MainLayout from "@/components/MainLayout";
import MeshGradient from "@/components/MeshGradient";

export default function Home() {
	return (
		<MainLayout>
			<MeshGradient />
			<main className="relative min-h-screen">
				<Hero />
				<AboutSection />
				<FeaturesSection />
			</main>
		</MainLayout>
	);
}
