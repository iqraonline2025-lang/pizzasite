"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Database } from 'lucide-react';
import BigFooter from '@/components/BigFooter';

export default function PrivacyPage() {
  const lastUpdated = "December 2025";

  const protocols = [
    {
      icon: <Database className="text-orange-500" size={24} />,
      title: "Data Collection",
      desc: "We only collect essential telemetry: your name, delivery coordinates, and contact signal (phone/email) to facilitate successful pizza deployment."
    },
    {
      icon: <Lock className="text-orange-500" size={24} />,
      title: "Secure Storage",
      desc: "Your data is encrypted behind industrial-grade firewalls. We do not store financial credentials; all transactions are handled via secure third-party encrypted gateways."
    },
    {
      icon: <EyeOff className="text-orange-500" size={24} />,
      title: "Third Party Policy",
      desc: "We do not sell your data to external agencies. Data is only shared with verified logistics partners (delivery drivers) to ensure your crust reaches you."
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
          <ShieldCheck size={14} className="text-green-500" /> Protocol 7.1
        </span>
      </nav>

      {/* 2. CONTENT HERO */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="mb-16">
          <p className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Security Document</p>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8] text-slate-900">
            Privacy <span className="text-orange-500">Policy.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-8">
            Last System Update: {lastUpdated}
          </p>
        </div>

        {/* 3. PROTOCOL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {protocols.map((p, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-orange-500/30 transition-colors">
              <div className="mb-6">{p.icon}</div>
              <h3 className="text-lg font-black uppercase italic mb-3 text-slate-900">{p.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* 4. FULL TEXT AREA */}
        <div className="prose prose-slate max-w-none border-t border-slate-100 pt-16 space-y-12">
          <section>
            <h2 className="text-2xl font-black uppercase italic text-slate-900">01. Information We Collect</h2>
            <p className="text-slate-600 font-medium leading-relaxed mt-4">
              When you interact with the Pizza HQ platform, we collect information that identifies you ("Personal Data"). This includes your IP address, browser type, and order history. This is used to optimize our digital kitchen performance and user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase italic text-slate-900">02. Cookies & Tracking</h2>
            <p className="text-slate-600 font-medium leading-relaxed mt-4">
              Our site uses "Session Cookies" to remember what is in your cart while you browse. Without these, our system would forget your order every time you clicked a new page. We do not use persistent tracking cookies for invasive advertising.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase italic text-slate-900">03. Your Rights</h2>
            <p className="text-slate-600 font-medium leading-relaxed mt-4">
              You have the right to request a complete wipe of your data from our servers. To initiate a data purge, please contact the HQ Command via our contact page.
            </p>
          </section>
        </div>
      </section>

      {/* 5. FOOTER */}
      <BigFooter />
    </main>
  );
}