"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full h-screen bg-[#050505] overflow-hidden flex items-center">
      
      {/* 1. THE MAIN IMAGE (FULL COVER) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop" 
          alt="Gourmet Pizza"
          className="w-full h-full object-cover opacity-60"
        />
        {/* Cinematic Vignette & Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10" />
      </div>

      <div className="relative z-20 container mx-auto px-6 md:px-12 flex flex-col items-start">
        
        {/* 2. TEXT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-orange-500" />
            <span className="text-orange-500 font-bold uppercase tracking-[0.4em] text-xs">
              Hand-Tossed & Coal-Fired
            </span>
          </div>

          <h1 className="text-white text-6xl md:text-9xl font-black leading-[0.9] uppercase tracking-tighter mb-8">
            PURE <br />
            <span className="italic text-transparent" style={{ WebkitTextStroke: "2px #f97316" }}>CRAFT</span> <br />
            PIZZA
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-light">
            Experience the legendary taste of sourdough crust, organic San Marzano tomatoes, and 100% whole milk mozzarella.
          </p>

          <div className="flex flex-wrap gap-6 items-center">
            <Link href="/menu">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#000000" }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 text-white px-12 py-5 rounded-sm font-bold uppercase text-[10px] tracking-[0.3em] transition-all shadow-2xl"
              >
                Order Now
              </motion.button>
            </Link>
            
            <div className="flex flex-col">
              <span className="text-white font-black text-2xl">$16.00</span>
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Starting Price</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. INTERACTIVE DECORATION (SIDE BADGE) */}
      <motion.div 
        initial={{ rotate: 90, opacity: 0 }}
        animate={{ rotate: 90, opacity: 1 }}
        className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden lg:block"
      >
        <span className="text-white/10 text-[120px] font-black leading-none uppercase select-none">
          EST. 1994
        </span>
      </motion.div>

    </section>
  );
}