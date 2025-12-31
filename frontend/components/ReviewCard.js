import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex-shrink-0 w-[350px] mx-2 relative overflow-hidden group">
      {/* Decorative Background Quote */}
      <Quote className="absolute -right-2 -top-2 text-slate-50 size-24 group-hover:text-orange-50 transition-colors duration-500" />
      
      <div className="relative z-10">
        {/* Star Rating */}
        <div className="flex text-orange-500 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              fill={i < (review.rating || 5) ? "currentColor" : "none"} 
            />
          ))}
        </div>
        
        {/* Review Body */}
        <p className="text-slate-600 font-medium italic mb-6 leading-relaxed min-h-[80px]">
          "{review.comment}"
        </p>
        
        {/* Customer Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-black text-sm uppercase">
            {review.customerName?.charAt(0) || "P"}
          </div>
          <div>
            <h4 className="font-black uppercase text-slate-800 text-sm tracking-tight">
              {review.customerName || "Guest User"}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Verified Customer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}