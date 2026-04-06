import { TopBar } from "@/components/layouts/TopBar";
import { HeroSection } from "@/components/features/landing/HeroSection";
import { PowerUpsGrid } from "@/components/features/landing/PowerUpsGrid";
import { CTASection } from "@/components/features/landing/CTASection";
import { Footer } from "@/components/features/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <TopBar />

      <main className="pt-16">
        <HeroSection />
        <PowerUpsGrid />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
