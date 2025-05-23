import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import FeatureCards from "@/components/feature-cards"
import VerificationSection from "@/components/verification-section"
import CtaSection from "@/components/cta-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeatureCards />
      <VerificationSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
