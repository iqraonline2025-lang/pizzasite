"use client";

import PizzaGrid from '@/components/PizzaGrid';
import Hero from '@/components/Hero';
import FloatingCart from '@/components/FloatingCart';
import ReviewCarousel from '@/components/ReviewCarousel';
import ContactSection from '@/components/ContactSection'; // 1. Import the new component
import BigFooter from '@/components/BigFooter';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white">
      {/* 1. Impactful Entry */}
      <Hero />
      
      {/* 2. Product Selection */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-black uppercase italic mb-8 tracking-tighter text-slate-800">
          Our <span className="text-orange-500">Menu</span>
        </h2>
        <PizzaGrid />
      </section>

      {/* 3. Social Proof (Reviews) */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">
              Customer <span className="text-orange-500">Vibes</span>
            </h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
              Straight from the HQ community
            </p>
          </div>
          
          <ReviewCarousel />
        </div>
      </section>

      {/* 4. Contact & Location Section (GSAP Animated) */}
      <ContactSection />
      
      {/* 5. Global UI Elements */}
      <FloatingCart />

      <BigFooter />
    </main>
  );
}