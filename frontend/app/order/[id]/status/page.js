"use client";
import React, { useState, useEffect, use } from 'react';
import { Truck, Clock, MapPin, ExternalLink, CheckCircle, PartyPopper } from 'lucide-react';

const OrderStatusPage = ({ params }) => {
  // Properly unwrap the dynamic ID from the URL
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data from your Backend
  const updateStatus = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/payment/orders/${orderId}`);
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateStatus();
    // Live Polling: Check for updates every 10 seconds
    const interval = setInterval(updateStatus, 10000); 
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Connecting to Lab...</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <p className="text-slate-400 font-bold">Order not found in our records.</p>
      </div>
    </div>
  );

  const steps = ["paid", "preparing", "out_for_delivery", "delivered"];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-slate-50 p-4 pt-32 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 relative overflow-hidden">
        
        {/* Delivered Background Effect */}
        {order.status === "delivered" && (
            <div className="absolute top-0 left-0 w-full h-2 bg-green-500 animate-pulse" />
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
            Track <span className="text-orange-500 font-black">Lab</span> Results
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Serial No: {order._id.slice(-8)}
          </p>
        </div>

        {/* Progress Tracker Visual */}
        <div className="relative flex justify-between mb-12 px-2">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-col items-center z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 
                ${i <= currentStepIndex 
                  ? (order.status === 'delivered' ? 'bg-green-500 border-green-100 text-white' : 'bg-orange-500 border-orange-100 text-white') 
                  : 'bg-slate-100 border-transparent text-slate-300'}`}>
                {i <= currentStepIndex ? <CheckCircle size={18} /> : <div className="w-2 h-2 bg-current rounded-full" />}
              </div>
              <p className={`text-[8px] font-black uppercase mt-3 transition-colors duration-500 
                ${i <= currentStepIndex ? 'text-slate-900' : 'text-slate-300'}`}>
                {step.replace('_', ' ')}
              </p>
            </div>
          ))}
          
          {/* Progress Bars */}
          <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 -z-0" />
          <div className={`absolute top-5 left-0 h-[2px] transition-all duration-1000 -z-0 
            ${order.status === 'delivered' ? 'bg-green-500' : 'bg-orange-500'}`} 
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }} />
        </div>

        {/* Conditional Content based on Status */}
        <div className="min-h-[220px] flex flex-col justify-center">
            {order.status === "delivered" ? (
                <div className="text-center space-y-4 animate-in zoom-in duration-500">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                        <PartyPopper className="text-green-600 w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black italic text-slate-900">MISSION COMPLETE</h2>
                    <p className="text-sm font-bold text-slate-400 uppercase">Your order has been safely delivered.</p>
                </div>
            ) : order.status === "out_for_delivery" ? (
                <div className="space-y-4 animate-in slide-in-from-bottom-4">
                    <div className="bg-slate-900 rounded-3xl p-6 text-white text-center shadow-xl shadow-orange-500/10">
                        <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest mb-1">Live ETA</p>
                        <h2 className="text-5xl font-black italic mb-6 tracking-tighter">{order.deliveryETA || "Calculated"}</h2>
                        
                        <a 
                            href={order.deliveryTrackingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full bg-orange-500 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-white hover:text-orange-600 transition-all group"
                        >
                            <ExternalLink size={14} className="group-hover:scale-110 transition-transform" /> Open Uber Live Map
                        </a>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
                    <Clock className="mx-auto text-slate-300 mb-2 animate-pulse" size={32} />
                    <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">
                        {currentStepIndex < 1 ? "Awaiting Payment Confirmation..." : 
                         currentStepIndex === 1 ? "Chef is formulating your pizza..." : 
                         "Coordinating with Uber Direct..."}
                    </p>
                </div>
            )}
        </div>

        {/* Address Footer */}
        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <MapPin className="text-slate-400" size={18} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Destination Coordinates</p>
            <p className="text-xs font-bold text-slate-800 leading-tight truncate">{order.customer?.address || "Loading..."}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderStatusPage;