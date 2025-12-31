"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie, Info, ShieldCheck, Zap } from 'lucide-react';
import BigFooter from '@/components/BigFooter';

export default function CookieSettingsPage() {
  const lastUpdated = "December 2025";

  const cookieTypes = [
    {
      title: "Essential Cookies",
      status: "Always Active",
      desc: "Necessary for the HQ to function. These handle your cart memory and secure login sessions. Without these, you cannot procure pizza.",
      icon: <ShieldCheck className="text-green-500" size={20} />
    },
    {
      title: "Performance Telemetry",
      status: "Optimization Only",
      desc: "Anonymized data that helps our engineers understand which pizzas are trending and if the site is running at peak velocity.",
      icon: <Zap className="text-orange-500" size={20} />
    }
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* 1. HEADER NAV */}
      <nav className="p-6 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 font-black uppercase italic text-[10px] text-slate-400 hover:text-orange-500 transition-colors">
          <ArrowLeft size={14} /> Return to HQ
        </Link>
        <span className="font-black text-[10px] uppercase tracking-widest text-slate-900 flex items-center gap-2">
          <Cookie size={14} className="text-orange-500" /> Cookie Protocol
        </span>
      </nav>

      {/* 2. CONTENT HERO */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="mb-16">
          <p className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Preference Management</p>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8] text-slate-900">
            Cookie <span className="text-orange-500">Policy.</span>
          </h1>
          <p className="text-slate-500 font-bold mt-8 max-w-xl leading-relaxed">
            To provide a high-performance experience, we use digital cookies. This policy details how we deploy them across the HQ network.
          </p>
        </div>

        {/* 3. COOKIE TYPE CARDS */}
        <div className="space-y-4 mb-20">
          {cookieTypes.map((c, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex gap-4">
                <div className="mt-1">{c.icon}</div>
                <div>
                  <h3 className="text-xl font-black uppercase italic text-slate-900">{c.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-md mt-2">{c.desc}</p>
                </div>
              </div>
              <div className="bg-white px-6 py-2 rounded-full border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {c.status}
              </div>
            </div>
          ))}
        </div>

        {/* 4. TECHNICAL BREAKDOWN */}
        <div className="prose prose-slate max-w-none border-t border-slate-100 pt-16">
          <h2 className="text-2xl font-black uppercase italic text-slate-900 mb-6 flex items-center gap-3">
            <Info size={24} className="text-orange-500" /> Technical Breakdown
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-medium text-slate-600">
              <thead className="border-b border-slate-100">
                <tr className="text-slate-900 uppercase text-[10px] tracking-widest">
                  <th className="py-4">Cookie Name</th>
                  <th className="py-4">Source</th>
                  <th className="py-4">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr>
                  <td className="py-4 font-bold text-slate-900">hq_cart_id</td>
                  <td className="py-4 italic">Internal</td>
                  <td className="py-4 text-slate-400">Session</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-slate-900">hq_session_token</td>
                  <td className="py-4 italic">Internal</td>
                  <td className="py-4 text-slate-400">24 Hours</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-slate-900">_ga_telemetry</td>
                  <td className="py-4 italic">Google Analytics</td>
                  <td className="py-4 text-slate-400">2 Years</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-12 text-slate-400 text-xs italic">
            Last Protocol Sync: {lastUpdated}. You may disable cookies in your browser settings, but please note this will result in a "Mission Failure" during the checkout process.
          </p>
        </div>
      </section>

      {/* 5. FOOTER */}
      <BigFooter />
    </main>
  );
}