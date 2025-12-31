"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/cartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  // 1. EMPTY STATE
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ShoppingBag className="text-slate-200 w-20 h-20 mb-6 mx-auto" strokeWidth={1} />
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Your bag is empty.</h2>
          <p className="text-slate-500 font-medium mb-8">Items you add to your order will appear here.</p>
          <Link href="/">
            <button className="px-10 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-colors">
              Explore Menu
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-16 border-b border-slate-200 pb-10">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-6 text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Menu
          </Link>
          <div className="flex justify-between items-end">
            <h1 className="text-7xl font-black tracking-tighter leading-none">
              Your <span className="text-orange-600">Order</span>
            </h1>
            <span className="text-slate-400 font-bold text-sm">{cart.length} items</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* 2. ITEM LIST */}
          <div className="lg:col-span-2 space-y-12">
            <AnimatePresence mode='popLayout'>
              {cart.map((item, idx) => (
                <motion.div
                  key={`${item._id}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col md:flex-row gap-8 items-start border-b border-slate-100 pb-12 last:border-0"
                >
                  {/* Image */}
                  <div className="w-full md:w-48 aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  </div>

                  {/* Content */}
                  <div className="flex-grow space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-black tracking-tight text-slate-900 uppercase">{item.name}</h3>
                        <p className="text-orange-600 text-xs font-black uppercase tracking-widest mt-1">{item.size}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(idx)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {/* Toppings list */}
                    {item.toppings?.length > 0 && (
                      <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        <span className="text-slate-900 font-bold uppercase text-[10px] mr-2">Extras:</span>
                        {item.toppings.join(", ")}
                      </p>
                    )}

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center border border-slate-200 rounded-full px-2 py-1">
                        <button onClick={() => updateQuantity(idx, -1)} className="p-2 hover:text-orange-600 transition-colors"><Minus size={14}/></button>
                        <span className="text-sm font-black w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(idx, 1)} className="p-2 hover:text-orange-600 transition-colors"><Plus size={14}/></button>
                      </div>
                      <span className="text-2xl font-black italic tracking-tighter text-slate-900">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 3. SUMMARY ASIDE */}
          <aside className="lg:sticky lg:top-40">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 pb-4 border-b border-slate-50">Order Summary</h4>
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-900">£{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Delivery</span>
                  <span className="text-green-600 font-bold uppercase text-xs">Calculated at next step</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-10 pt-6 border-t border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Total</span>
                <span className="text-5xl font-black tracking-tighter leading-none">£{cartTotal.toFixed(2)}</span>
              </div>

              {/* Checkout Link */}
              <Link href="/checkout">
                <button className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]">
                  Checkout Now
                </button>
              </Link>

              <div className="mt-8 flex items-center justify-center gap-4 opacity-20 grayscale">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="visa" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="mastercard" />
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}