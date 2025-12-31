"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, Gavel, FileText, AlertTriangle } from 'lucide-react';
import BigFooter from '@/components/BigFooter';

export default function TermsPage() {
  const lastUpdated = "December 2025";

  const terms = [
    {
      icon: <Gavel className="text-orange-500" size={24} />,
      title: "The Agreement",
      desc: "By accessing Pizza HQ, you enter into a binding operational agreement. You agree to use this platform for legitimate pizza acquisition only."
    },
    {
      icon: <FileText className="text-orange-500" size={24} />,
      title: "Order Protocols",
      desc: "All orders are final once the kitchen goes 'Live'. Ensure your coordinates and contact signal are 100% accurate before transmission."
    },
    {
      icon: <AlertTriangle className="text-orange-500" size={24} />,
      title: "Liability",
      desc: "Pizza HQ is responsible for the science of the crust. We are not liable for any addiction to our 72-hour fermentation process."
    }
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* 1. HEADER NAV */}
      <nav className="p-6 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 font-black uppercase italic text-[10px] text-slate-400 hover:text-orange-500 transition-colors">
          <ArrowLeft size={14} /> Back to HQ
        </Link>
        <span className="font-black text-[10px] uppercase tracking-widest text-slate-900 flex items-center gap-2">
          <Scale size={14} className="text-orange-500" /> Operational Terms
        </span>
      </nav>

      {/* 2. CONTENT HERO */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="mb-16">
          <p className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Legal Framework</p>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8] text-slate-900">
            Terms of <span className="text-orange-500">Service.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-8">
            Effective Date: {lastUpdated}
          </p>
        </div>

        {/* 3. KEY HIGHLIGHT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {terms.map((t, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <div className="mb-6">{t.icon}</div>
              <h3 className="text-lg font-black uppercase italic mb-3 text-slate-900">{t.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* 4. LEGAL TEXT SECTION */}
        <div className="prose prose-slate max-w-none border-t border-slate-100 pt-16 space-y-12">
          <section>
            <h2 className="text-2xl font-black uppercase italic text-slate-900">01. Service Description</h2>
            <p className="text-slate-600 font-medium leading-relaxed mt-4">
              Pizza HQ provides a digital interface for the customization and procurement of engineered food products. We reserve the right to modify menu specifications, pricing, and operational hours without prior signal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase italic text-slate-900">02. User Conduct</h2>
            <p className="text-slate-600 font-medium leading-relaxed mt-4">
              Users are prohibited from attempting to bypass our secure ordering systems or reverse-engineering our proprietary dough hydration ratios. Any unauthorized access to the HQ backend will result in an immediate permanent ban.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase italic text-slate-900">03. Refund & Cancellation</h2>
            <p className="text-slate-600 font-medium leading-relaxed mt-4">
              Due to the perishable nature of our thermal-shocked products, cancellations are only accepted if the order has not yet entered the 'Pre-Heat' phase. Once the pizza has entered the oven, the contract is fulfilled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase italic text-slate-900">04. Governing Law</h2>
            <p className="text-slate-600 font-medium leading-relaxed mt-4">
              These terms are governed by the laws of the United Kingdom. Any disputes will be settled in the jurisdiction of Blackburn, England.
            </p>
          </section>
        </div>
      </section>

      {/* 5. FOOTER */}
      <BigFooter />
    </main>
  );
}