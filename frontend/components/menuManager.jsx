"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3 } from "lucide-react";

export default function MenuManagerUI() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: "Classic",
    available: true,
  });
  const [editPizza, setEditPizza] = useState(null);

  // Fetch all pizzas
  const fetchPizzas = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pizzas`);
      const data = await res.json();
      setPizzas(data);
    } catch (err) {
      console.error("Failed to fetch pizzas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add new pizza
  const addPizza = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.image) return alert("Fill all fields");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pizzas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const newPizza = await res.json();
      setPizzas((prev) => [newPizza, ...prev]);
      setForm({ name: "", price: "", image: "", category: "Classic", available: true });
    } catch (err) {
      console.error("Failed to add pizza:", err);
    }
  };

  // Delete pizza
  const deletePizza = async (id) => {
    if (!confirm("Delete this pizza?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pizzas/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      setPizzas((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete pizza:", err);
    }
  };

  // Save edits
  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pizzas/${editPizza._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editPizza, price: Number(editPizza.price) }),
      });
      const updated = await res.json();
      setPizzas((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      setEditPizza(null);
    } catch (err) {
      console.error("Failed to save edit:", err);
    }
  };

  if (loading)
    return <div className="p-20 text-center font-black animate-pulse">LOADING KITCHEN...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12">
      {/* Stats Summary */}
      <div className="flex gap-4 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex-1">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Pizzas</p>
          <p className="text-3xl font-black italic">{pizzas.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex-1">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Live on Web</p>
          <p className="text-3xl font-black italic text-green-600">
            {pizzas.filter((p) => p.available).length}
          </p>
        </div>
      </div>

      {/* Add Pizza Form */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 mb-12">
        <h2 className="text-xl font-black uppercase italic mb-6 flex items-center gap-2">
          <Plus className="text-orange-500" size={20} /> New Pizza Entry
        </h2>
        <form onSubmit={addPizza} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
              placeholder="E.g. Pepperoni"
            />
          </div>
          {/* Price */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Price (£)</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
              placeholder="12.50"
            />
          </div>
          {/* Category */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
            >
              <option value="Classic">Classic</option>
              <option value="Veggie">Veggie</option>
              <option value="Meat">Meat</option>
            </select>
          </div>
          {/* Image URL */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
              placeholder="https://..."
            />
          </div>
          <div className="md:col-span-4 mt-2">
            <button className="w-full bg-slate-900 text-white font-black uppercase py-5 rounded-2xl text-[10px] tracking-widest hover:bg-orange-600 transition-all">
              Add to Menu
            </button>
          </div>
        </form>
      </section>

      {/* Pizza Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Pizza
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Price
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Status
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pizzas.map((pizza) => (
              <tr key={pizza._id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={pizza.image}
                      className="w-12 h-12 rounded-xl object-cover shadow-sm"
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="font-black uppercase italic text-sm tracking-tight">
                        {pizza.name}
                      </span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {pizza.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 font-black text-sm text-slate-700">
                  £{pizza.price.toFixed(2)}
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
                      pizza.available
                        ? "bg-green-50 text-green-600 border-green-100"
                        : "bg-red-50 text-red-600 border-red-100"
                    }`}
                  >
                    {pizza.available ? "In Stock" : "Unavailable"}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => setEditPizza(pizza)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => deletePizza(pizza._id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editPizza && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 text-slate-800">
              Edit <span className="text-orange-500">Item</span>
            </h2>
            <form onSubmit={saveEdit} className="space-y-4">
              <input
                value={editPizza.name}
                onChange={(e) => setEditPizza({ ...editPizza, name: e.target.value })}
                className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold"
              />
              <input
                type="number"
                value={editPizza.price}
                onChange={(e) => setEditPizza({ ...editPizza, price: e.target.value })}
                className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold"
              />
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="text-xs font-black uppercase text-slate-400">Available</span>
                <input
                  type="checkbox"
                  checked={editPizza.available}
                  onChange={(e) =>
                    setEditPizza({ ...editPizza, available: e.target.checked })
                  }
                  className="w-5 h-5 accent-orange-500"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditPizza(null)}
                  className="flex-1 bg-slate-100 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
