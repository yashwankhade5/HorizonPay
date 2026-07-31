import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { NonCustodial } from "../components/NonCustodial";
import { Primitives } from "../components/Primitives";
import { Comparison } from "../components/Comparison";
import { StatsSection } from "../components/StatsSection";
import { DeveloperExperience } from "../components/DeveloperExperience";
import { SecuritySection } from "../components/SecuritySection";
import { FooterCTA } from "../components/FooterCTA";
import { Footer } from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <NonCustodial />
        <Primitives />
        <Comparison />
        <StatsSection />
        <DeveloperExperience />
        <SecuritySection />
        <FooterCTA />
      </main>
      <Footer />
    </div>
  );
}
