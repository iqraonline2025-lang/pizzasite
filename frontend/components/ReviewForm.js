"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

const ReviewForm = ({ productId = "pizzahq-general" }) => {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); 
  const [formData, setFormData] = useState({
    customerName: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    gsap.fromTo(formRef.current, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // NOTE: Added the full localhost URL to match your AdminPage
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, productId }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ customerName: '', rating: 5, comment: '' });
        // Hide success message after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error("Submit error:", err);
      setStatus('error');
    }
  };

  return (
    <div ref={formRef} className="max-w-md mx-auto p-8 bg-white rounded-[2.5rem] shadow-xl border border-gray-100">
      <h3 className="text-2xl font-black uppercase italic mb-6 text-slate-800 tracking-tighter">Leave a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Your Name</label>
          <input
            required
            placeholder="e.g. John D."
            className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-orange-500/20 focus:bg-white outline-none transition-all font-bold text-slate-700"
            value={formData.customerName}
            onChange={(e) => setFormData({...formData, customerName: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Rating</label>
          <select 
            className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-700 appearance-none"
            value={formData.rating}
            onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
          >
            {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Comment</label>
          <textarea
            required
            rows="3"
            placeholder="How was the pizza?"
            className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-orange-500/20 focus:bg-white outline-none transition-all font-bold text-slate-700"
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg hover:bg-orange-500 transition-colors disabled:bg-slate-300"
        >
          {status === 'loading' ? 'Sending...' : 'Post Review'}
        </motion.button>
      </form>

      <AnimatePresence>
        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 bg-green-500 text-white rounded-2xl text-center text-xs font-black uppercase tracking-tighter"
          >
            Pizza Love Received! (Awaiting Approval)
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div className="mt-4 p-4 bg-red-500 text-white rounded-2xl text-center text-xs font-black uppercase tracking-tighter">
            Something went wrong.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewForm;