"use client";

import { useEffect, useState } from "react";
import PizzaModal from "./PizzaModel";

export default function PizzaGrid() {
  const [pizzas, setPizzas] = useState([]);
  const [filter, setFilter] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [limit, setLimit] = useState(6);
  const [selectedPizza, setSelectedPizza] = useState(null);

  const INITIAL_LIMIT = 6;

  useEffect(() => {
    fetch("http://localhost:5000/api/pizzas")
      .then(res => res.json())
      .then(data => setPizzas(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const filteredPizzas = pizzas.filter(pizza => {
    const matchesAvailable = onlyAvailable ? pizza.available : true;
    
    // FIX: Case-insensitive category matching
    const pizzaCat = pizza.category?.toLowerCase() || "";
    const filterCat = filter.toLowerCase();
    const matchesCategory = filter === "All" || pizzaCat === filterCat;
    
    return matchesAvailable && matchesCategory;
  });

  const visiblePizzas = filteredPizzas.slice(0, limit);

  const handleShowMore = () => setLimit(prev => prev + 3);
  const handleShowLess = () => {
    setLimit(INITIAL_LIMIT);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div id="menu" className="max-w-7xl mx-auto p-4 md:p-8 bg-[#fdfdfd] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Crafted with <span className="text-orange-500 italic">Passion.</span>
        </h2>
        <p className="text-slate-500 font-medium">Discover our hand-tossed artisan pizzas</p>
      </div>

      {/* FILTER BAR */}
      <div className="sticky top-6 z-40 flex flex-col md:flex-row justify-between items-center mb-16 gap-6 bg-white/80 backdrop-blur-xl p-3 md:p-5 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white/50">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar px-2">
          {["All", "Classic", "Veggie", "Meat"].map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setLimit(INITIAL_LIMIT); }}
              className={`px-7 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
                filter === cat 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-300" 
                : "bg-transparent text-slate-500 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-3 cursor-pointer text-slate-700 font-bold text-sm px-4">
          <div className="relative">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={onlyAvailable}
              onChange={e => { setOnlyAvailable(e.target.checked); setLimit(INITIAL_LIMIT); }}
            />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-orange-500 transition-colors duration-300"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
          </div>
          Available Only
        </label>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {visiblePizzas.map((pizza, index) => (
          <div 
            key={pizza._id} 
            className="group relative bg-white rounded-[3rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-50 flex flex-col h-full"
          >
            <div className="relative h-64 md:h-72 w-full overflow-hidden rounded-[2.5rem] mb-6 shadow-inner">
              <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute top-4 left-4">
                <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-xl">
                  {pizza.category}
                </span>
              </div>
              {!pizza.available && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[3px] flex items-center justify-center">
                  <span className="bg-white/90 px-6 py-2 rounded-2xl text-red-600 font-black text-xs uppercase tracking-widest shadow-2xl">Sold Out</span>
                </div>
              )}
            </div>

            <div className="px-4 pb-4 flex flex-col flex-grow">
              <h3 className="text-2xl font-black text-slate-800 mb-2">{pizza.name}</h3>
              <p className="text-slate-400 text-sm font-medium mb-6 line-clamp-2 italic">
                {pizza.toppings?.join(" • ") || "House specialty pizza."}
              </p>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                <div>
                  <span className="block text-[10px] uppercase font-black text-slate-400 tracking-tighter">Starting from</span>
                  <span className="text-2xl font-black text-slate-900">£{pizza.price.toFixed(2)}</span>
                </div>
                <button 
                  disabled={!pizza.available}
                  onClick={() => setSelectedPizza(pizza)}
                  className={`flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                    pizza.available ? "bg-slate-900 text-white hover:bg-orange-500 shadow-lg" : "bg-slate-100 text-slate-300"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col items-center justify-center mt-24 mb-12">
        {limit < filteredPizzas.length ? (
          <button onClick={handleShowMore} className="px-14 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-500 transition-all">
            Discover More
          </button>
        ) : filteredPizzas.length > INITIAL_LIMIT ? (
          <button onClick={handleShowLess} className="px-14 py-5 bg-white border-2 border-slate-100 text-slate-400 rounded-[2rem] font-black text-xs uppercase hover:text-slate-900 hover:border-slate-900 transition-all">
            Back to Top
          </button>
        ) : null}
      </div>

      {selectedPizza && <PizzaModal pizza={selectedPizza} onClose={() => setSelectedPizza(null)} />}
    </div>
  );
}