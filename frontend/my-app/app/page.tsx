import { LandingHeader } from '../components/landing/header'
import { HeroSection } from '@/components/landing/hero'
import { FeaturesSection } from '@/components/landing/features'
import { LandingFooter } from '@/components/landing/footer'

export const metadata = {
  title: 'HorizonPay - Trustless Stablecoin Payments for the Internet',
  description: 'Accept USDC payments with single-step APIs on Solana. Settlement in seconds, zero chargebacks.',
}

export default function Home() {
  return (
    <>
      <LandingHeader />
      <main className="min-h-screen flex flex-col">
        <HeroSection />
        <FeaturesSection />
        <div className="flex-grow"></div>
        <LandingFooter />
      </main>
    </>
  )
}
