"use client";

import AboutSection from "@/app/components/AboutSection";
import FeaturesSection from "@/app/components/FeaturesSection";
import Hero from "@/app/components/Hero";
import MainLayout from "@/components/MainLayout";
import styles from "./Home.module.css";

export default function Home() {
	return (
		<MainLayout>
			<main className="min-h-screen">
				<Hero heroBackgroundClass={styles.heroBackground} />
				<AboutSection />
				<FeaturesSection />
			</main>
		</MainLayout>
	);
}
