"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Hexagon, User, Activity, Zap, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../context/cartContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 
      ${isScrolled 
        ? 'p-3 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 shadow-xl' 
        : 'p-6 bg-slate-900 border-b border-white/5'}`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LEFT: LOGO & SYSTEM MENU */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 bg-white/10 border border-white/10 rounded-xl text-white hover:bg-orange-500 hover:border-orange-400 transition-all group"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} className="group-hover:rotate-90 transition-transform" />}
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <Hexagon className="w-10 h-10 text-orange-500 fill-orange-500/10 group-hover:rotate-180 transition-transform duration-1000" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="text-lg font-black text-white tracking-tighter leading-none italic uppercase">
                PIZZA<span className="text-orange-500">LAB</span>
              </span>
              <span className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-1">v.2.0.5</span>
            </div>
          </Link>
        </div>

        {/* CENTER: LIVE TELEMETRY */}
        <div className="hidden lg:flex items-center gap-6 bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5">
          <div className="flex items-center gap-2">
            <Activity size={10} className="text-orange-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Status: <span className="text-green-400 animate-pulse">Optimal</span></span>
          </div>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-300">
            <Zap size={10} className="text-orange-500" />
            <span>Load: <span className="text-white">Active</span></span>
          </div>
        </div>

        {/* RIGHT: UTILITIES */}
        <div className="flex items-center gap-3">
          <Link href="/order-status" className="p-3 text-slate-400 hover:text-white transition-colors hidden xs:block">
            <User size={18} strokeWidth={1.5} />
          </Link>

          <Link href="/cart" className="relative p-3 bg-white/10 border border-white/10 rounded-xl group overflow-hidden">
            <ShoppingCart className="w-5 h-5 text-white group-hover:text-orange-400 transition-colors" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-orange-500 text-white text-[8px] font-black w-4 h-4 rounded-md flex items-center justify-center border border-slate-900">
                {cartCount}
              </span>
            )}
          </Link>

          <Link href="/menu">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-lg shadow-orange-500/10 active:scale-95">
              Launch Menu
            </button>
          </Link>
        </div>
      </nav>

      {/* OVERLAY MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-slate-800 border-b border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Laboratory (Home)", path: "/" },
                { name: "The Lineup (Menu)", path: "/menu" },
                { name: "Our Science (Story)", path: "/story" },
                { name: "Signal HQ (Contact)", path: "/contact" }
              ].map((item) => (
                <Link 
                  key={item.name} 
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-8 py-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-orange-500/50 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all flex items-center justify-between group"
                >
                  {item.name}
                  <Hexagon size={12} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}