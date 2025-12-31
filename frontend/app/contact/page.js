"use client";

import React, { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import BigFooter from '@/components/BigFooter';
import FloatingCart from '@/components/FloatingCart';
import ContactSection from '@/components/ContactSection'; // Reusing your map component
import { ArrowLeft, Send, MessageSquare, Mail, Zap } from 'lucide-react';
import gsap from 'gsap';

export default function ContactPage() {
  const formRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".contact-field", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for form submission goes here
    alert("Transmission Received. HQ will respond shortly.");
  };

  return (
    <main className="bg-white min-h-screen">
      {/* 1. NAV */}
      <nav className="p-6 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 font-black uppercase italic text-[10px] text-slate-400 hover:text-orange-500 transition-colors">
          <ArrowLeft size={14} /> Escape to Home
        </Link>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
           <span className="font-black text-[10px] uppercase tracking-widest text-slate-900">Comms Link Active</span>
        </div>
      </nav>

      {/* 2. HERO / FORM SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        <div className="space-y-8">
          <div>
            <p className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Direct Channel</p>
            <h1 className="text-7xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8] text-slate-900">
              Send a <span className="text-orange-500">Signal.</span>
            </h1>
          </div>
          
          <div className="space-y-6 text-slate-500 font-bold max-w-md">
            <p className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <Mail className="text-orange-500" size={20} /> 
              hello@pizzahq.com
            </p>
            <p className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <MessageSquare className="text-orange-500" size={20} /> 
              Feedback & Catering Enquiries
            </p>
            <div className="bg-slate-900 text-white p-6 rounded-3xl mt-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-2">Priority Support</p>
              <p className="text-xl italic">"Our engineers respond to all signals within 24 operational hours."</p>
            </div>
          </div>
        </div>

        {/* 3. INTERACTIVE FORM */}
        <div ref={formRef} className="bg-slate-50 p-10 lg:p-14 rounded-[3.5rem] border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="contact-field flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Name</label>
              <input 
                type="text" 
                placeholder="Operational Agent Name"
                className="bg-white border-none rounded-2xl p-5 text-slate-900 focus:ring-2 focus:ring-orange-500 transition-all font-bold"
                required
              />
            </div>

            <div className="contact-field flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Email Address</label>
              <input 
                type="email" 
                placeholder="agent@hq.com"
                className="bg-white border-none rounded-2xl p-5 text-slate-900 focus:ring-2 focus:ring-orange-500 transition-all font-bold"
                required
              />
            </div>

            <div className="contact-field flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Transmission Message</label>
              <textarea 
                rows="4"
                placeholder="What's the status?"
                className="bg-white border-none rounded-2xl p-5 text-slate-900 focus:ring-2 focus:ring-orange-500 transition-all font-bold resize-none"
                required
              />
            </div>

            <button className="contact-field w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-orange-500 transition-all active:scale-95 shadow-xl shadow-slate-200">
              Secure Send <Send size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* 4. REUSE MAP SECTION */}
      <div className="border-t border-slate-50">
        <ContactSection />
      </div>

      <BigFooter />
      <FloatingCart />
    </main>
  );
}