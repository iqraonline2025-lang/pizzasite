"use client";
import React, { useState } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from '../../context/cartContext'; // Ensure path is correct
import { Truck, Lock, ArrowRight, Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "", email: "", address: "", city: "", postcode: ""
  });

  const handleProceedToPayment = async () => {
    // Validation
    const isFormIncomplete = Object.values(customerDetails).some(val => val.trim() === "");
    if (isFormIncomplete) {
      alert("Please fill in all delivery details first.");
      return;
    }

    setIsInitializing(true);
    try {
      const response = await fetch("http://localhost:5000/api/payment/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items: cart, 
          customerDetails, 
          amount: cartTotal // This was the missing piece!
        }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to initialize payment");
      
      setClientSecret(data.clientSecret);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">
        
        {/* LEFT: DELIVERY & PAYMENT */}
        <div className="flex-grow space-y-12">
          <section>
            <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-3"><Truck /> 1. Delivery</h2>
            <div className="grid grid-cols-2 gap-4">
              <input onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})} type="text" placeholder="Full Name" className="col-span-2 p-4 rounded-xl border" />
              <input onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})} type="email" placeholder="Email" className="col-span-2 p-4 rounded-xl border" />
              <input onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})} type="text" placeholder="Street Address" className="col-span-2 p-4 rounded-xl border" />
              <input onChange={(e) => setCustomerDetails({...customerDetails, city: e.target.value})} type="text" placeholder="City" className="p-4 rounded-xl border" />
              <input onChange={(e) => setCustomerDetails({...customerDetails, postcode: e.target.value})} type="text" placeholder="Postcode" className="p-4 rounded-xl border" />
            </div>
            
            {!clientSecret && (
              <button onClick={handleProceedToPayment} disabled={isInitializing} className="mt-6 w-full bg-orange-600 text-white py-5 rounded-2xl font-black uppercase flex items-center justify-center gap-3">
                {isInitializing ? <Loader2 className="animate-spin" /> : "Confirm Details & Pay"} <ArrowRight />
              </button>
            )}
          </section>

          <section className={!clientSecret ? 'opacity-30 pointer-events-none' : 'opacity-100'}>
            <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-3"><Lock /> 2. Payment</h2>
            {clientSecret && (
              <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                <CheckoutForm cartTotal={cartTotal} />
              </Elements>
            )}
          </section>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <aside className="lg:w-[400px]">
          <div className="bg-white p-8 rounded-[2rem] border shadow-xl sticky top-32">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Your Order</h3>
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between mb-2">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-bold">£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-6 pt-6 flex justify-between items-end">
              <span className="text-orange-600 font-bold">Total</span>
              <span className="text-4xl font-black tracking-tighter">£{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CheckoutForm({ cartTotal }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/success` },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button disabled={loading || !stripe} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase">
        {loading ? "Verifying..." : `Authorize £${cartTotal.toFixed(2)}`}
      </button>
    </form>
  );
}