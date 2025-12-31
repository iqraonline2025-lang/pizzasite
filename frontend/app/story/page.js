"use client";

import React, { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import BigFooter from '@/components/BigFooter';
import FloatingCart from '@/components/FloatingCart';
import { ArrowLeft, Beaker, Zap, ShieldCheck, Microscope } from 'lucide-react';
import gsap from 'gsap';

export default function StoryPage() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Reveal lines one by one
      gsap.from(".story-reveal", {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "expo.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="bg-white min-h-screen">
      {/* SIMPLE NAV */}
      <nav className="p-6 flex justify-between items-center bg-white sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 font-black uppercase italic text-[10px] text-slate-400 hover:text-orange-500 transition-colors">
          <ArrowLeft size={14} /> Return to Base
        </Link>
        <div className="font-black text-slate-900 italic tracking-tighter">PIZZA HQ / 01</div>
      </nav>

      {/* HERO SECTION */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <p className="story-reveal text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-6">Our DNA</p>
        <h1 className="story-reveal text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] text-slate-900 mb-12">
          It’s Not Cooking.<br />
          It’s <span className="text-orange-500 underline decoration-slate-900">Engineering.</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
          <div className="story-reveal space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 w-fit">
              <Microscope className="text-orange-500" size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase italic">The 72-Hour Fermentation</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              We don't rush the process. Our dough undergoes a strictly controlled 72-hour cold fermentation cycle. This breaks down complex starches into simple sugars, creating a crust that is incredibly light, airy, and easy on the gut.
            </p>
          </div>

          <div className="story-reveal space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 w-fit">
              <Zap className="text-orange-500" size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase italic">450°C Thermal Shock</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Our ovens aren't just hot; they are calibrated. By hitting the dough with a massive burst of heat instantly, we lock in moisture while creating that iconic leopard-spotting on the crust. Science meets fire.
            </p>
          </div>
        </div>
      </section>

      {/* MID-PAGE STATS */}
      <section className="bg-slate-900 py-20 overflow-hidden relative">
         <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            <div>
              <p className="text-orange-500 text-4xl font-black italic tracking-tighter">003</p>
              <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-2">Days of Aging</p>
            </div>
            <div>
              <p className="text-orange-500 text-4xl font-black italic tracking-tighter">100%</p>
              <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-2">Zero Additives</p>
            </div>
            <div>
              <p className="text-orange-500 text-4xl font-black italic tracking-tighter">450°C</p>
              <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-2">Oven Temp</p>
            </div>
            <div>
              <p className="text-orange-500 text-4xl font-black italic tracking-tighter">∞ / 10</p>
              <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-2">Vibe Level</p>
            </div>
         </div>
         {/* Background large text */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] italic pointer-events-none select-none">
           PROCESS
         </div>
      </section>

      {/* FINAL CALL */}
      <section className="py-32 px-6 text-center">
        <ShieldCheck className="mx-auto text-orange-500 mb-8" size={64} strokeWidth={1} />
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 mb-6">
          Ready to test the results?
        </h2>
        <Link href="/menu">
          <button className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs hover:bg-orange-500 transition-all active:scale-95">
            View Research (Menu)
          </button>
        </Link>
      </section>

      <BigFooter />
      <FloatingCart />
    </main>
  );
}