"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/cartContext"; // Import the hook

export default function PizzaModal({ pizza, onClose }) {
  const { addToCart } = useCart(); // Destructure addToCart
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [price, setPrice] = useState(pizza.price);

  const TOPPING_FEE = 1.50; // Sync with Backend

  useEffect(() => {
    const basePrice = pizza.sizes?.[selectedSize] || pizza.price;
    const toppingsTotal = selectedToppings.length * TOPPING_FEE;
    setPrice(basePrice + toppingsTotal);
  }, [selectedSize, selectedToppings, pizza]);

  const handleToppingChange = (topping) => {
    setSelectedToppings(prev => 
      prev.includes(topping) ? prev.filter(t => t !== topping) : [...prev, topping]
    );
  };

  const handleAddToCart = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/validate-price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pizzaId: pizza._id,
          size: selectedSize,
          toppings: selectedToppings,
          clientPrice: price
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Error: ${data.error}`);
      } else {
        // SUCCESS: Add to global cart state
        addToCart({
          _id: pizza._id,
          name: pizza.name,
          image: pizza.image,
          price: price, // The final calculated price
          size: selectedSize,
          toppings: selectedToppings
        });
        
        onClose();
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[3rem] max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="md:w-1/2 h-64 md:h-auto bg-slate-100">
          <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col h-[80vh] md:h-[600px] overflow-y-auto">
          <div className="mb-8">
            <span className="text-orange-500 font-black text-xs uppercase tracking-widest">{pizza.category}</span>
            <h2 className="text-4xl font-black text-slate-900 mt-2">{pizza.name}</h2>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <h3 className="text-sm font-black text-slate-400 uppercase mb-4">1. Size</h3>
            <div className="grid grid-cols-3 gap-3">
              {["Small", "Medium", "Large"].map(size => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)} 
                  className={`py-3 rounded-2xl font-bold border-2 transition-all ${
                    selectedSize === size 
                    ? "border-orange-500 bg-orange-50 text-orange-600" 
                    : "border-slate-100 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Toppings Selection */}
          <div className="mb-8 flex-grow">
            <h3 className="text-sm font-black text-slate-400 uppercase mb-4">2. Extra Toppings (+£1.50)</h3>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
              {pizza.toppings.map((topping, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleToppingChange(topping)} 
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    selectedToppings.includes(topping) ? "border-orange-500 bg-orange-50" : "border-slate-50"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 ${
                    selectedToppings.includes(topping) ? "bg-orange-500 border-orange-500" : "border-slate-200"
                  }`} />
                  <span className="text-xs font-bold text-slate-700">{topping}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer / Action */}
          <div className="pt-6 border-t border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Amount</span>
            <span className="text-3xl font-black text-slate-900 block mb-6">£{price.toFixed(2)}</span>
            <button 
              onClick={handleAddToCart} 
              className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-orange-500 transition-all active:scale-95 shadow-lg"
            >
              Add To Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}