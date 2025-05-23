import Footer from "@/components/shared/Footer";
import { twMerge } from "tailwind-merge";

export default function MainLayout({ children, className, hideFooter = false }) {
  return (
    <div className={twMerge("flex min-h-screen flex-col", className)}>
      <div className="flex-grow">
        {children}
      </div>
      
      {!hideFooter && <Footer />}
    </div>
  );
}
