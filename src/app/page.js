"use client";

import AboutSection from "@/components/home/AboutSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import Hero from "@/components/home/Hero";
import MainLayout from "@/components/shared/MainLayout";
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
