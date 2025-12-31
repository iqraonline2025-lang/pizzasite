"use client";

import React, { useLayoutEffect, useRef } from 'react';
import { Phone, MapPin, Clock, Navigation, ArrowRight, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactSection() {
  const containerRef = useRef(null);
  const cardItems = useRef([]);

  // --- STATIC DATA (Since Backend is None) ---
  const DATA = {
    phone: "01254 555 999",
    phoneRaw: "+441254555999",
    address: "123 Pizza Street, Blackburn, BB1 7BT",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2360.2!2d-2.48!3d53.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTPCsDQ1JzAwLjAiTiAywrAyOCcwMC4wIlc!5e0!3m2!1sen!2suk!4v123456789", 
    hours: [
      { day: "Mon - Thu", time: "11:00 - 23:00" },
      { day: "Fri - Sat", time: "11:00 - 01:00" },
      { day: "Sunday", time: "12:00 - 22:00" }
    ]
  };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Title reveal
      gsap.from(".title-reveal", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".title-reveal",
          start: "top 90%",
        }
      });

      // Staggered cards
      gsap.from(cardItems.current, {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      });

      // Map scale-in
      gsap.from(".map-frame", {
        scale: 0.95,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".map-frame",
          start: "top 80%",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-white py-24 px-6 sm:px-12 lg:px-20 overflow-hidden" id="contact">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER AREA */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div className="title-reveal">
            <p className="text-orange-500 font-black uppercase tracking-[0.4em] text-xs mb-4">Location & Orders</p>
            <h2 className="text-7xl md:text-9xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.8]">
              The <span className="text-orange-500">HQ</span>
            </h2>
          </div>
          <div className="flex gap-4">
             <div className="bg-slate-100 p-4 rounded-2xl hidden md:block">
                <Star className="text-orange-500 animate-pulse" fill="currentColor" />
             </div>
             <p className="text-slate-500 font-bold max-w-[200px] text-sm italic">
               Voted best local crust three years running.
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: INFO STACK */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* CALL NOW (Interactive) */}
            <a 
              href={`tel:${DATA.phoneRaw}`}
              ref={el => cardItems.current[0] = el}
              className="group bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex items-center justify-between hover:bg-orange-500 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-orange-200"
            >
              <div className="flex items-center gap-6">
                <div className="bg-white p-5 rounded-3xl text-orange-500 group-hover:scale-110 transition-transform shadow-sm">
                  <Phone size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-white/80 tracking-widest">Order Hotline</span>
                  <p className="text-3xl font-black text-slate-900 group-hover:text-white leading-none mt-1">{DATA.phone}</p>
                </div>
              </div>
              <ArrowRight className="text-slate-300 group-hover:text-white group-hover:translate-x-2 transition-all" />
            </a>

            {/* ADDRESS CARD */}
            <div 
              ref={el => cardItems.current[1] = el}
              className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex items-center gap-6"
            >
              <div className="bg-slate-900 text-white p-5 rounded-3xl">
                <MapPin size={32} strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Find Us</span>
                <p className="text-xl font-bold text-slate-800 leading-tight mt-1">{DATA.address}</p>
              </div>
            </div>

            {/* HOURS CARD */}
            <div 
              ref={el => cardItems.current[2] = el}
              className="bg-slate-900 text-white p-10 rounded-[3.5rem] relative overflow-hidden shadow-2xl shadow-slate-200"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center rotate-3">
                    <Clock size={24} className="text-white" />
                  </div>
                  <h3 className="font-black uppercase italic tracking-widest text-sm text-orange-500">Operation Hours</h3>
                </div>
                <div className="space-y-4">
                  {DATA.hours.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-sm font-bold text-slate-400 uppercase">{item.day}</span>
                      <span className="text-sm font-black text-orange-500 bg-white/5 px-4 py-1.5 rounded-xl">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative text */}
              <p className="absolute -right-6 -bottom-8 text-9xl font-black text-white/[0.03] italic pointer-events-none">PIZZA</p>
            </div>
          </div>

          {/* RIGHT: MAP AREA */}
          <div className="lg:col-span-7 map-frame h-full min-h-[550px]">
            <div className="h-full w-full bg-slate-50 p-4 rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200 relative group overflow-hidden">
              <div className="h-full w-full rounded-[3rem] overflow-hidden relative border-4 border-white">
                <iframe
                  title="Pizza HQ Map Location"
                  src={DATA.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale contrast-125 hover:grayscale-0 transition-all duration-1000 ease-in-out scale-105 group-hover:scale-100"
                ></iframe>
                
                {/* Floating Directions Button */}
                <div className="absolute bottom-8 right-8">
                  <button className="bg-white/90 backdrop-blur-md text-slate-900 px-8 py-5 rounded-2xl font-black uppercase text-xs flex items-center gap-3 shadow-2xl border border-white hover:bg-orange-500 hover:text-white transition-all group-hover:scale-110">
                    <Navigation size={18} fill="currentColor" />
                    Live Directions
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}