"use client";
import React, { useLayoutEffect, useRef } from 'react';
import Link from 'next/link'; // Import Link
import { Instagram, Twitter, Facebook, ArrowUpRight, Smartphone, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BigFooter() {
  const footerRef = useRef(null);
  const bigTextRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. The "Fill" Effect
      gsap.fromTo(".footer-big-text", 
        { y: 150, opacity: 0 },
        { 
          y: 0, 
          opacity: 0.15, 
          duration: 2, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 60%",
          }
        }
      );

      // 2. Staggered reveal for navigation links
      gsap.from(".footer-link-item", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 40%",
        }
      });

      // 3. Subtle parallax on the background glow
      gsap.to(".bg-glow", {
        scale: 1.2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer 
      ref={footerRef} 
      className="relative min-h-screen bg-slate-900 flex flex-col justify-between p-8 lg:p-20 overflow-hidden text-white border-t border-white/5"
    >
      <div className="bg-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-[radial-gradient(circle,_rgba(249,115,22,0.1)_0%,_transparent_70%)] pointer-events-none z-0" />

      {/* 1. TOP SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 z-10">
        <div className="footer-link-item">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-orange-500 fill-orange-500" size={16} />
            <h3 className="text-orange-500 font-black uppercase tracking-[0.3em] text-xs">HQ Social</h3>
          </div>
          <div className="flex gap-6">
            {['Instagram', 'Twitter', 'Facebook'].map((social) => (
              <a key={social} href="#" className="p-4 bg-white/5 rounded-2xl hover:bg-orange-500 hover:text-white transition-all duration-300">
                {social === 'Instagram' && <Instagram size={24} />}
                {social === 'Twitter' && <Twitter size={24} />}
                {social === 'Facebook' && <Facebook size={24} />}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 lg:gap-32">
          <div className="footer-link-item space-y-6">
            <h4 className="font-black uppercase text-[10px] text-slate-500 tracking-[0.2em]">Explore</h4>
            <ul className="space-y-4 font-black text-2xl tracking-tighter uppercase italic">
              <li className="hover:text-orange-500 transition-colors">
                <Link href="/menu" className="flex items-center gap-2">Menu <ArrowUpRight size={18}/></Link>
              </li>
              <li className="hover:text-orange-500 transition-colors">
                <Link href="/story" className="flex items-center gap-2">Story <ArrowUpRight size={18}/></Link>
              </li>
              <li className="hover:text-orange-500 transition-colors">
                <Link href="/contact" className="flex items-center gap-2">Contact <ArrowUpRight size={18}/></Link>
              </li>
            </ul>
          </div>
          <div className="footer-link-item space-y-6">
            <h4 className="font-black uppercase text-[10px] text-slate-500 tracking-[0.2em]">Safety</h4>
            <ul className="space-y-4 font-bold text-lg text-slate-400">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-white">Cookie Settings</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. CENTER SECTION */}
      <div className="flex-1 flex flex-col justify-center items-center py-20 relative">
        <div ref={bigTextRef} className="footer-big-text text-center select-none pointer-events-none">
          <h2 className="text-[18vw] font-[1000] italic uppercase leading-[0.7] tracking-tighter opacity-10">
            PIZZA HQ
          </h2>
        </div>
        
        <div className="absolute flex flex-col items-center gap-6">
            <p className="text-lg md:text-2xl font-black italic uppercase text-white tracking-widest text-center">
              The science of <span className="text-orange-500">Perfect Crust</span>
            </p>
            <Link href="/menu">
              <button className="bg-orange-500 text-white px-14 py-7 rounded-[2rem] font-black uppercase text-xl hover:bg-white hover:text-slate-900 transition-all shadow-[0_0_50px_rgba(249,115,22,0.3)] flex items-center gap-4 group active:scale-95">
                Start Your Order <Smartphone className="group-hover:rotate-12 transition-transform" />
              </button>
            </Link>
        </div>
      </div>

      {/* 3. BOTTOM SECTION */}
      <div className="footer-link-item flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-12 gap-8 z-10">
        <div className="flex items-center gap-10">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            Blackburn, UK • 2025
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hidden lg:block">
            Designed for Performance
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live Status: Accepting Orders</span>
          </div>
        </div>
      </div>
    </footer>
  );
}