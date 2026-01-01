"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ReviewCard from './ReviewCard';

export default function ReviewCarousel() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`);
        const data = await res.json();
        
        // Filter to only show approved reviews
        const approved = Array.isArray(data) ? data.filter(r => r.isApproved) : [];
        setReviews(approved);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-pulse font-black text-slate-300 uppercase italic tracking-widest">Loading Vibes...</div>
    </div>
  );

  // If no approved reviews exist, we hide the section entirely
  if (reviews.length === 0) return null;

  return (
    <div className="relative overflow-hidden py-10">
      {/* Edge Fades for a professional look */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 hidden md:block"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 hidden md:block"></div>

      <motion.div 
        className="flex w-max"
        animate={{ x: [0, -1000] }}
        transition={{ 
          repeat: Infinity, 
          duration: 40, 
          ease: "linear" 
        }}
      >
        {/* We loop the array multiple times to create the infinite scroll effect */}
        {[...reviews, ...reviews, ...reviews, ...reviews].map((review, idx) => (
          <ReviewCard key={`${review._id}-${idx}`} review={review} />
        ))}
      </motion.div>
    </div>
  );
}