"use client";
import React, { useState } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from '../../context/cartContext';
import { Truck, Lock, ArrowRight, Loader2 } from 'lucide-react';

// Load Stripe with environment variable
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "", email: "", address: "", city: "", postcode: ""
  });
  const [apiError, setApiError] = useState("");

  // Trigger backend to create Stripe payment
  const handleProceedToPayment = async () => {
    setApiError("");
    // Validation
    const incomplete = Object.values(customerDetails).some(val => val.trim() === "");
    if (incomplete) {
      alert("Please fill in all delivery details first.");
      return;
    }

    setIsInitializing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart,
            customerDetails,
            amount: Math.round(cartTotal * 100) // Convert to pence/cents
          })
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to initialize payment");
      }

      const data = await response.json();
      if (!data.clientSecret) throw new Error("Payment initialization failed: missing clientSecret");

      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error(error);
      setApiError(error.message);
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
            <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-3">
              <Truck /> 1. Delivery
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="col-span-2 p-4 rounded-xl border"
                value={customerDetails.name}
                onChange={e => setCustomerDetails({ ...customerDetails, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="col-span-2 p-4 rounded-xl border"
                value={customerDetails.email}
                onChange={e => setCustomerDetails({ ...customerDetails, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Street Address"
                className="col-span-2 p-4 rounded-xl border"
                value={customerDetails.address}
                onChange={e => setCustomerDetails({ ...customerDetails, address: e.target.value })}
              />
              <input
                type="text"
                placeholder="City"
                className="p-4 rounded-xl border"
                value={customerDetails.city}
                onChange={e => setCustomerDetails({ ...customerDetails, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="Postcode"
                className="p-4 rounded-xl border"
                value={customerDetails.postcode}
                onChange={e => setCustomerDetails({ ...customerDetails, postcode: e.target.value })}
              />
            </div>

            {apiError && <p className="text-red-600 mt-2 font-bold">{apiError}</p>}

            {!clientSecret && (
              <button
                onClick={handleProceedToPayment}
                disabled={isInitializing}
                className="mt-6 w-full bg-orange-600 text-white py-5 rounded-2xl font-black uppercase flex items-center justify-center gap-3"
              >
                {isInitializing ? <Loader2 className="animate-spin" /> : "Confirm Details & Pay"} <ArrowRight />
              </button>
            )}
          </section>

          {/* PAYMENT SECTION */}
          {clientSecret && (
            <section className="opacity-100">
              <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-3">
                <Lock /> 2. Payment
              </h2>

              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: { theme: 'stripe' }
                }}
              >
                <CheckoutForm cartTotal={cartTotal} disabled={!clientSecret} />
              </Elements>
            </section>
          )}
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

function CheckoutForm({ cartTotal, disabled }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || disabled) return;
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
      <button
        disabled={loading || !stripe || disabled}
        className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase"
      >
        {loading ? "Verifying..." : `Authorize £${cartTotal.toFixed(2)}`}
      </button>
    </form>
  );
}

