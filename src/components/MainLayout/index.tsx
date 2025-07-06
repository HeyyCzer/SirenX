import Footer from "@/components/Footer";
import { twMerge } from "tailwind-merge";

interface MainLayoutProps {
	children: React.ReactNode;
	className?: string;
	hideFooter?: boolean;
}

export default function MainLayout({ children, className, hideFooter = false }: MainLayoutProps) {
	return (
		<div className={twMerge("flex min-h-screen flex-col", className)}>
			<div className="flex-grow">
				{children}
			</div>

			{!hideFooter && <Footer />}
		</div>
	);
}
