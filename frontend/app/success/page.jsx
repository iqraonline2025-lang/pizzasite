"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Timer, Hash, Loader2, ShoppingBag, Truck, ExternalLink } from 'lucide-react';
import { useCart } from '../../context/cartContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    if (clearCart) clearCart();

    const fetchOrderDetails = async () => {
      if (!paymentIntentId) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`http://localhost:5000/api/payment/order-status/${paymentIntentId}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrderData(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
    
    // Optional: Poll every 10 seconds to see if the status changes to 'out_for_delivery'
    const interval = setInterval(fetchOrderDetails, 10000);
    return () => clearInterval(interval);
  }, [paymentIntentId, clearCart]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc]">
      <Loader2 className="animate-spin text-orange-600 mb-4" size={48} />
      <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">Verifying Payment...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl text-center border border-slate-50">
        
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} className="text-green-600" />
        </div>

        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
          Thanks, <span className="text-orange-600">{orderData?.customerName?.split(' ')[0] || 'User'}!</span>
        </h1>
        
        <p className="text-slate-500 font-medium mt-6 leading-relaxed">
          Your payment was successful. We are starting your order now!
        </p>

        {/* UBER SECTION: Only shows if status is 'out_for_delivery' */}
        {orderData?.status === "out_for_delivery" && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-[2rem] text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="text-white" size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tighter text-blue-900">Pizza is on the way!</h3>
            <p className="text-[10px] text-blue-600 font-bold mb-4 uppercase">Uber Driver Dispatched</p>
            
            <a 
              href={orderData.deliveryTrackingUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-blue-700 transition-colors"
            >
              Track Live Map <ExternalLink size={12} />
            </a>
          </div>
        )}

        {/* Standard Order Details */}
        <div className="mt-8 space-y-4 text-left bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Hash size={14} /> Order ID
            </span>
            <span className="font-mono font-bold text-[10px] text-slate-700 uppercase">
              {orderData?.orderId?.slice(-8) || "Pending..."}
            </span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Timer size={14} /> Status
            </span>
            <span className={`font-black uppercase text-[10px] tracking-widest ${orderData?.status === 'out_for_delivery' ? 'text-blue-600' : 'text-green-600'}`}>
              {orderData?.status === 'paid' ? 'Preparing' : orderData?.status?.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="mt-10">
          <Link href="/">
            <button className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-orange-600 transition-all flex items-center justify-center gap-3">
              Order More <ShoppingBag size={16} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}