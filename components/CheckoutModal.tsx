import React, { useState } from "react";
import { X, MapPin, Phone, User, ShoppingBag } from "lucide-react";
import { Product } from "../types";

interface CheckoutModalProps {
  product: Product | null;
  onClose: () => void;
}

export function CheckoutModal({
  product,
  onClose,
}: CheckoutModalProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !mobile.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pin.trim()
    ) {
      alert("Please fill all delivery details.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      alert("Please enter a valid 6-digit PIN code.");
      return;
    }

    try {
      setLoading(true);

      const order = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
        totalAmount: product.price * quantity,
        customerName: name.trim(),
        customerMobile: mobile.trim(),
        customerAddress: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pin: pin.trim(),
        paymentMethod: "COD",
        status: "Placed",
        createdAt: new Date().toISOString(),
      };

      console.log("COD Order:", order);

      alert(
        "Order placed successfully! Our team will contact you for confirmation."
      );

      onClose();
    } catch (error) {
      console.error("Order error:", error);
      alert("Unable to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[94vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/95 backdrop-blur border-b border-neutral-100">
          <div>
            <h2 className="text-lg font-black">Cash on Delivery</h2>
            <p className="text-xs text-neutral-500">
              Enter your delivery details
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={placeOrder} className="p-4 space-y-4">
          <div className="flex gap-3 p-3 rounded-2xl bg-neutral-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 rounded-xl object-cover"
            />

            <div className="min-w-0">
              <p className="text-sm font-bold line-clamp-2">
                {product.name}
              </p>

              <p className="text-lg font-black mt-1">
                ₹{product.price}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700">
              Quantity
            </label>

            <div className="flex items-center gap-3 mt-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-lg border border-neutral-200"
              >
                −
              </button>

              <span className="font-black">{quantity}</span>

              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-lg border border-neutral-200"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-neutral-200 outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold">Mobile Number</label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="10-digit mobile number"
                inputMode="numeric"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-neutral-200 outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold">Full Delivery Address</label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House/Flat, Street, Area, Landmark"
                rows={3}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-neutral-200 outline-none focus:border-rose-400 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="mt-1 w-full h-11 px-3 rounded-xl border border-neutral-200 outline-none focus:border-rose-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold">State</label>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className="mt-1 w-full h-11 px-3 rounded-xl border border-neutral-200 outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold">PIN Code</label>
            <input
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="6-digit PIN"
              inputMode="numeric"
              className="mt-1 w-full h-11 px-3 rounded-xl border border-neutral-200 outline-none focus:border-rose-400"
            />
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-700">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm font-black">
                Cash on Delivery
              </span>
            </div>

            <p className="text-xs text-emerald-700/80 mt-1">
              Pay when your order is delivered to your address.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs text-neutral-500">Total Amount</p>
              <p className="text-2xl font-black">
                ₹{product.price * quantity}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 h-12 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black"
            >
              {loading ? "Placing..." : "Place COD Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  }
