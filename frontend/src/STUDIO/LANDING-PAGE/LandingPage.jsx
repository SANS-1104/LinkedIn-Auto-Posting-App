import React, { useRef } from "react";
import { HeroSection } from "./HeroSection.jsx";
import { FeaturesSection } from "./FeaturesSection.jsx";
import { BenefitsSection } from "./BenefitsSection.jsx";
import { ProductPreviewSection } from "./ProductPreviewSection.jsx";
import { UseCasesSection } from "./UseCasesSection.jsx";
import { TestimonialsSection } from "./TestimonialsSection.jsx";
import { PricingSection } from "./PricingSection.jsx";
import { FinalCTASection } from "./FinalCTASection.jsx";
import { Footer } from "./Footer.jsx";
import "../../globals.css"

export default function LandingPage() {
  const pricingRef = useRef(null);

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <HeroSection onScrollToPricing={scrollToPricing} />
      <FeaturesSection />
      <BenefitsSection />
      <ProductPreviewSection />
      <UseCasesSection />
      <TestimonialsSection />
      <div ref={pricingRef}>
        <PricingSection />
      </div>
      <FinalCTASection onScrollToPricing={scrollToPricing}/>
      <Footer />
    </div>
  );
}
