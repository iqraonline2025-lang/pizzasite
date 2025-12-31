"use client";
import React, { useEffect, useState } from 'react';
import { Truck, CheckCircle, RefreshCcw, ExternalLink, MapPin, Hash } from 'lucide-react';

export default function AdminDashboardUI() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/payment/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDispatch = async (orderId) => {
    if (!confirm("Dispatch Uber driver for this order?")) return;

    try {
      const res = await fetch('http://localhost:5000/api/delivery/create-uber-delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      
      if (res.ok) {
        fetchOrders(); // Refresh the list to update status UI
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error}`);
      }
    } catch (err) {
      alert("Dispatch failed! Check console.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-black uppercase text-xs tracking-[0.3em]">
      Loading Kitchen Feed...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
              Live <span className="text-orange-600">Orders</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-3">
              Kitchen Management System v1.0
            </p>
          </div>
          <button 
            onClick={fetchOrders} 
            className="group p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95"
          >
            <RefreshCcw size={20} className="text-slate-600 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-6">
          {orders.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-100">
              <p className="font-bold text-slate-300 uppercase tracking-widest text-sm">No orders found yet</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col lg:flex-row items-center gap-8 hover:border-orange-100 transition-colors">
                
                {/* Customer Section */}
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-1 text-[9px] bg-slate-100 px-2 py-1 rounded font-mono font-bold text-slate-500">
                      <Hash size={10} /> {order._id.slice(-6)}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded tracking-widest ${
                      order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="font-black text-2xl uppercase italic tracking-tight">{order.customer.name}</h2>
                  <div className="flex items-center gap-1 text-slate-400 mt-1">
                    <MapPin size={14} />
                    <p className="text-xs font-bold uppercase tracking-tight">{order.customer.address}, {order.customer.postcode}</p>
                  </div>
                </div>

                {/* Items Section */}
                <div className="flex-1 w-full bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Basket Details</p>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-slate-200/50 pb-1 last:border-0">
                        <span className="text-xs font-black uppercase text-slate-700">{item.quantity}x {item.name}</span>
                        <span className="text-[10px] font-bold text-slate-400">{item.size}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Section */}
                <div className="w-full lg:w-auto min-w-[200px]">
                  {order.status === 'paid' ? (
                    <button 
                      onClick={() => handleDispatch(order._id)}
                      className="w-full bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
                    >
                      <Truck size={18} /> Dispatch Uber
                    </button>
                  ) : order.status === 'out_for_delivery' ? (
                    <a 
                      href={order.deliveryTrackingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-blue-50 text-blue-600 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 border border-blue-100 hover:bg-blue-100 transition-all"
                    >
                      <ExternalLink size={16} /> Track Driver
                    </a>
                  ) : (
                    <div className="w-full bg-slate-50 text-slate-300 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 border border-slate-100 italic">
                      <CheckCircle size={16} /> Ready
                    </div>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}