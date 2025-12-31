"use client";
import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, ExternalLink, CheckCircle, Package } from 'lucide-react';

const TrackingPage = ({ params }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Order Status (Polled every 15 seconds)
  const fetchStatus = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/payment/orders/${params.id}`);
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error("Tracking Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000); // Auto-update
    return () => clearInterval(interval);
  }, [params.id]);

  if (loading) return <div className="p-20 text-center font-black uppercase">Locating Driver...</div>;
  if (!order) return <div className="p-20 text-center">Order not found.</div>;

  // Logic for the progress bar
  const statuses = ["paid", "preparing", "out_for_delivery", "delivered"];
  const currentIdx = statuses.indexOf(order.status);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-md mx-auto bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="bg-slate-900 p-8 text-white text-center">
          <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Order Status</p>
          <h1 className="text-3xl font-black italic uppercase italic tracking-tighter">
            {order.status.replace(/_/g, ' ')}
          </h1>
        </div>

        <div className="p-8">
          {/* 2. PROGRESS TIMELINE */}
          <div className="relative flex justify-between mb-12">
            {statuses.map((s, i) => (
              <div key={s} className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${i <= currentIdx ? 'bg-orange-500 border-orange-100' : 'bg-slate-100 border-transparent'}`}>
                  {i <= currentIdx && <CheckCircle size={14} className="text-white" />}
                </div>
                <p className={`text-[8px] font-black uppercase mt-2 ${i <= currentIdx ? 'text-slate-900' : 'text-slate-300'}`}>{s.replace(/_/g, ' ')}</p>
              </div>
            ))}
            <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-100 -z-0"></div>
            <div className="absolute top-4 left-0 h-[2px] bg-orange-500 transition-all duration-1000 -z-0" style={{ width: `${(currentIdx / (statuses.length - 1)) * 100}%` }}></div>
          </div>

          {/* 3. UBER TRACKING CARD */}
          {order.status === "out_for_delivery" ? (
            <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm"><Truck className="text-orange-500" /></div>
                <div>
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Live ETA</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tighter">{order.deliveryETA || "Calculating..."}</p>
                </div>
              </div>
              
              <a 
                href={order.deliveryTrackingUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg"
              >
                <ExternalLink size={14} /> View Live Uber Map
              </a>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-8 text-center border-2 border-dashed border-slate-200">
              <Clock className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase italic">Waiting for kitchen to finish...</p>
            </div>
          )}

          {/* 4. ADDRESS INFO */}
          <div className="mt-8 pt-8 border-t border-slate-50">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-slate-400 mt-1" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Delivering To</p>
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {order.customer.address}<br/>
                  {order.customer.city}, {order.customer.postcode}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrackingPage;