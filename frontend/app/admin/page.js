"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Truck, RefreshCcw, MapPin, Pizza, LayoutDashboard, Trash, 
  Star, MessageSquare, PlusCircle, Search, Timer, 
  Map as MapIcon, PackageCheck, AlertCircle, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [reviews, setReviews] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); 
  
  // Forms state
  const [form, setForm] = useState({ name: "", price: "", image: "", category: "Classic" });
  const [reviewForm, setReviewForm] = useState({ customerName: "", rating: 5, comment: "" });
  const [trackingInput, setTrackingInput] = useState({ id: null, url: "", eta: "" });

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [orderRes, pizzaRes, reviewRes] = await Promise.all([
        fetch('http://localhost:5000/api/payment/orders'),
        fetch('http://localhost:5000/api/pizzas'),
        fetch('http://localhost:5000/api/reviews/admin/all')
      ]);

      if (orderRes.ok) setOrders(await orderRes.json());
      if (pizzaRes.ok) setPizzas(await pizzaRes.json());
      if (reviewRes.ok) setReviews(await reviewRes.json());
    } catch (err) { 
      console.error("Sync Error:", err); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const password = prompt("Admin Access Required:");
      if (password === "supersecret") {
        setIsAuthorized(true);
        fetchAllData();
      } else {
        window.location.href = "/";
      }
    };
    checkAuth();
  }, [fetchAllData]);

  const updateStatus = async (id, newStatus, trackingData = {}) => {
    try {
      const res = await fetch(`http://localhost:5000/api/payment/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: newStatus,
          deliveryTrackingUrl: trackingData.url,
          deliveryETA: trackingData.eta 
        }),
      });
      if (res.ok) {
        setTrackingInput({ id: null, url: "", eta: "" });
        fetchAllData();
      }
    } catch (err) { alert("Status sync failed"); }
  };

  const addReview = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...reviewForm, isApproved: true }),
    });
    if (res.ok) {
      setReviewForm({ customerName: "", rating: 5, comment: "" });
      fetchAllData();
    }
  };

  if (!isAuthorized) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black uppercase italic tracking-tighter">Authenticating...</div>;
  }

  const filteredOrders = orders.filter(o => 
    o.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o._id.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-orange-100">
      {/* SIDEBAR */}
      <nav className="fixed h-full w-64 bg-slate-900 text-white p-6 z-50 shadow-2xl">
        <div className="mb-10 flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-500/20"><Pizza size={24} /></div>
          <h1 className="font-black italic text-2xl uppercase tracking-tighter">Pizza<span className="text-orange-500">HQ</span></h1>
        </div>
        <div className="space-y-3">
          {[{ id: "orders", icon: <LayoutDashboard size={18}/>, label: "Live Orders" },
            { id: "menu", icon: <Pizza size={18}/>, label: "Menu Editor" },
            { id: "reviews", icon: <MessageSquare size={18}/>, label: "Review Center" }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === tab.id ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40" : "text-slate-400 hover:bg-white/5"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="ml-64 flex-1 p-10">
        <header className="flex justify-between items-end mb-12">
          <div>
            <p className="text-orange-500 font-black uppercase text-[10px] tracking-[0.3em] mb-1">HQ Command Center</p>
            <h2 className="text-5xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">{activeTab}</h2>
          </div>
          <button onClick={fetchAllData} className="bg-white p-4 rounded-2xl border-2 border-slate-100 text-slate-400 hover:text-orange-500 transition-all shadow-sm">
            <RefreshCcw size={22} className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              {filteredOrders.map((order) => {
                const stages = ["pending", "paid", "preparing", "out_for_delivery", "delivered"];
                const currentIdx = stages.indexOf(order.status);
                const progress = ((currentIdx + 1) / stages.length) * 100;

                return (
                  <div key={order._id} className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 relative group overflow-hidden">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-3xl font-black text-slate-800 uppercase italic">{order.customer?.name}</h3>
                        <p className="text-slate-400 font-bold flex items-center gap-1 text-sm mt-1"><MapPin size={16} className="text-orange-500"/> {order.customer?.address}</p>
                      </div>
                      
                      {/* STATUS CONTROLS */}
                      <div className="flex flex-col gap-2 items-end">
                        {order.status === "paid" && (
                          <button onClick={() => updateStatus(order._id, "preparing")} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:bg-orange-500 shadow-lg transition-all">Start Prep</button>
                        )}
                        
                        {order.status === "preparing" && (
                          <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-3xl border border-slate-200">
                            <input 
                              type="text" placeholder="Tracking URL" 
                              className="text-xs p-2 rounded-lg border outline-none focus:border-orange-500"
                              value={trackingInput.id === order._id ? trackingInput.url : ""}
                              onChange={(e) => setTrackingInput({ ...trackingInput, id: order._id, url: e.target.value })}
                            />
                            <input 
                              type="text" placeholder="ETA (e.g. 15 mins)" 
                              className="text-xs p-2 rounded-lg border outline-none focus:border-orange-500"
                              value={trackingInput.id === order._id ? trackingInput.eta : ""}
                              onChange={(e) => setTrackingInput({ ...trackingInput, id: order._id, eta: e.target.value })}
                            />
                            <button 
                              onClick={() => updateStatus(order._id, "out_for_delivery", { url: trackingInput.url, eta: trackingInput.eta })}
                              className="bg-orange-500 text-white px-4 py-2 rounded-xl font-black uppercase text-[10px] flex items-center gap-2"
                            >
                              <Truck size={14}/> Dispatch
                            </button>
                          </div>
                        )}

                        {order.status === "out_for_delivery" && (
                          <div className="flex gap-2">
                            <button onClick={() => updateStatus(order._id, "delivered")} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 transition-all"><PackageCheck size={18}/> Delivered</button>
                            {order.deliveryTrackingUrl && (
                               <a href={order.deliveryTrackingUrl} target="_blank" className="bg-blue-500 text-white p-4 rounded-2xl"><ExternalLink size={20}/></a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="relative mb-10 px-2">
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-orange-500" />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-[2.5rem] flex justify-between items-center">
                      <div className="flex flex-wrap gap-3">
                        {order.items?.map((item, i) => (
                          <div key={i} className="bg-white border px-4 py-2 rounded-xl font-bold uppercase text-[10px]"><span className="text-orange-500">{item.quantity}x</span> {item.name}</div>
                        ))}
                      </div>
                      {order.deliveryETA && (
                        <div className="flex items-center gap-2 text-orange-500 font-black">
                          <Timer size={20}/> <span>{order.deliveryETA}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* ADMIN REVIEW FORM */}
              <div className="bg-white p-8 rounded-[3rem] shadow-xl border-2 border-orange-500/5 mb-10">
                <h3 className="font-black uppercase italic mb-6 flex items-center gap-2"><PlusCircle className="text-orange-500"/> Add Official Review</h3>
                <form onSubmit={addReview} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input value={reviewForm.customerName} onChange={(e)=>setReviewForm({...reviewForm, customerName: e.target.value})} className="bg-slate-50 p-4 rounded-2xl font-bold outline-none" placeholder="Name" required />
                  <select value={reviewForm.rating} onChange={(e)=>setReviewForm({...reviewForm, rating: Number(e.target.value)})} className="bg-slate-50 p-4 rounded-2xl font-bold">
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                  <input value={reviewForm.comment} onChange={(e)=>setReviewForm({...reviewForm, comment: e.target.value})} className="bg-slate-50 p-4 rounded-2xl font-bold outline-none md:col-span-2" placeholder="Review text..." required />
                  <button className="bg-slate-900 text-white p-4 rounded-2xl font-black uppercase hover:bg-orange-500">Post Review</button>
                </form>
              </div>

              {reviews.map((r) => (
                <div key={r._id} className={`bg-white p-8 rounded-[2.5rem] flex items-center justify-between border-2 ${r.isApproved ? 'border-transparent' : 'border-orange-200 bg-orange-50/20'}`}>
                  <div>
                    <div className="flex text-orange-500 mb-1">{[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor"/>)}</div>
                    <h3 className="text-xl font-black uppercase text-slate-800">{r.customerName}</h3>
                    <p className="text-slate-500 italic">"{r.comment}"</p>
                  </div>
                  {!r.isApproved && <button onClick={() => approveReview(r._id)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:bg-orange-500 transition-all">Approve</button>}
                </div>
              ))}
            </motion.div>
          )}
          {/* Menu Tab remains same as your previous working version */}
        </AnimatePresence>
      </main>
    </div>
  );
}