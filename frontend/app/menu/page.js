"use client";

import React, { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowLeft, Flame, Star, Sparkles, Smartphone } from 'lucide-react';

// Import your custom components
import PizzaGrid from '@/components/PizzaGrid';
import FloatingCart from '@/components/FloatingCart';
import BigFooter from '@/components/BigFooter';

export default function MenuPage() {
  const headerRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Header Entrance
      gsap.from(".menu-reveal", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "expo.out"
      });

      // Background decorative parallax
      gsap.to(".bg-float", {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="bg-white min-h-screen selection:bg-orange-500 selection:text-white">
      
      {/* 1. MINIMAL NAVIGATION */}
      <nav className="p-6 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 font-black uppercase italic text-[10px] text-slate-400 hover:text-orange-500 transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to HQ
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-green-500 w-1.5 h-1.5 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Kitchen Live</span>
        </div>
      </nav>

      {/* 2. MENU HEADER */}
      <header ref={headerRef} className="relative py-20 px-6 overflow-hidden">
        {/* Decorative background element */}
        <div className="bg-float absolute top-10 right-10 text-slate-50 opacity-50 pointer-events-none select-none">
          <Sparkles size={120} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="menu-reveal flex justify-center gap-3 mb-6">
            <Flame size={18} className="text-orange-500 fill-orange-500" />
            <Star size={18} className="text-orange-500 fill-orange-500" />
            <Sparkles size={18} className="text-orange-500 fill-orange-500" />
          </div>
          
          <h1 className="menu-reveal text-7xl md:text-9xl font-black uppercase italic tracking-tighter text-slate-900 leading-[0.8]">
            Full <span className="text-orange-500">Lineup</span>
          </h1>
          
          <p className="menu-reveal text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-8 max-w-xs mx-auto leading-relaxed">
            Scientifically perfected crusts. Zero additive toppings.
          </p>
        </div>
      </header>

      {/* 3. PRODUCT GRID SECTION */}
      <section className="container mx-auto px-6 pb-32">
        <div className="bg-slate-50 rounded-[4rem] p-6 md:p-16 border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">
              The <span className="text-orange-500">Menu</span> / 2025
            </h2>
            <div className="h-[1px] flex-1 bg-slate-200 mx-8 hidden md:block"></div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Tap items to add to cart
            </p>
          </div>
          
          {/* Reusing your existing PizzaGrid component */}
          <PizzaGrid />
        </div>
      </section>

      {/* 4. CALL TO ACTION (Linked to Contact) */}
      <section className="py-24 bg-orange-500 text-white overflow-hidden relative group">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6 leading-none">
            Not sure what <br className="hidden md:block" /> to pick?
          </h2>
          <p className="font-bold text-orange-100 uppercase tracking-widest text-xs mb-10">
            Our flavor engineers are standing by.
          </p>
          
          <Link href="/contact">
            <button className="bg-white text-orange-500 px-14 py-6 rounded-[2rem] font-black uppercase text-lg shadow-2xl hover:bg-slate-900 hover:text-white transition-all active:scale-95 flex items-center gap-4 mx-auto group">
              Surprise Me <Smartphone className="group-hover:rotate-12 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Big background text for the CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-black text-white/10 italic pointer-events-none select-none uppercase">
          Help
        </div>
      </section>

      {/* 5. GLOBAL FOOTER */}
      <BigFooter />

      {/* 6. CART INTERFACE */}
      <FloatingCart />

    </main>
  );
}