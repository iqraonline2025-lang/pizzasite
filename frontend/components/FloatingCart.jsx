"use client";
import { useCart } from "../context/cartContext";
import { useState } from "react";

export default function FloatingCart() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show the cart if it's empty
  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[150] font-sans">
      {/* 1. FLOATING BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-500 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 relative group"
      >
        <div className="absolute -top-2 -left-2 bg-slate-900 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
          {cartCount}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span className="font-black text-sm pr-1">£{cartTotal.toFixed(2)}</span>
      </button>

      {/* 2. CART DRAWER */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black italic tracking-tight">Your Order</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Freshly Prepared</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Items List */}
          <div className="max-h-[400px] overflow-y-auto p-6 space-y-6">
            {cart.map((item, idx) => (
              <div key={`${item._id}-${idx}`} className="flex gap-4 group">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-slate-800 text-sm">{item.name}</h4>
                    <button onClick={() => removeFromCart(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-orange-500 font-black uppercase mb-2">{item.size}</p>
                  
                  {item.toppings.length > 0 && (
                    <p className="text-[9px] text-slate-400 font-medium italic mb-2 line-clamp-1">
                      + {item.toppings.join(", ")}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-slate-50 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(idx, -1)} 
                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-black px-2 w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(idx, 1)} 
                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-black text-slate-900 text-sm">£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Grand Total</span>
              <span className="text-2xl font-black text-slate-900">£{cartTotal.toFixed(2)}</span>
            </div>
            <button className="w-full py-5 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-200 uppercase text-xs tracking-[0.2em]">
              Checkout Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}