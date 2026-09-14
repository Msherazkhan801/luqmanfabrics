'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { CustomerDetails, PaymentMethod } from '../../lib/types';
import {
  ShieldCheck,
  Truck,
  PhoneCall,
  ShoppingBag,
  CreditCard,
  Banknote,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building,
  Info
} from 'lucide-react';

const POPULAR_PAKISTANI_CITIES = [
  'Shewa',
  'Swabi',
  'Peshawar',
  'Mardan',
  'Islamabad',
  'Rawalpindi',
  'Lahore',
  'Karachi',
  'Faisalabad',
  'Multan',
  'Gujranwala',
  'Sialkot',
  'Abbottabad',
  'Quetta',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Other City',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, shippingFee, discountAmount, appliedPromo, totalAmount, clearCart } = useCart();
  const { placeOrder, settings } = useStore();

  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: '',
    whatsappNumber: '',
    alternatePhone: '',
    email: '',
    address: '',
    city: 'Shewa',
    province: 'Khyber Pakhtunkhwa',
    postalCode: '',
    orderNotes: '',
  });

  const [customCity, setCustomCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-pearl-50">
        <div className="w-20 h-20 rounded-full bg-pearl-200 flex items-center justify-center text-neutral-400 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-neutral-900 mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-neutral-500 mb-6 max-w-sm">
          Please add fabrics to your shopping bag before proceeding to guest checkout.
        </p>
        <a
          href="/shop"
          className="px-8 py-3.5 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-md"
        >
          Explore Fabric Catalog
        </a>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('Please provide your full name.');
      return;
    }

    if (!formData.whatsappNumber.trim()) {
      setErrorMsg('Please enter your WhatsApp contact number for order confirmation.');
      return;
    }

    if (!formData.address.trim()) {
      setErrorMsg('Please enter complete delivery street address.');
      return;
    }

    const finalCity = formData.city === 'Other City' ? customCity.trim() || 'Other' : formData.city;

    setIsSubmitting(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        colorName: item.selectedColor.name,
        colorHex: item.selectedColor.hex,
        image: item.selectedColor.image || item.product.images[0],
        cutLength: item.product.cutLength,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
      }));

      const newOrder = placeOrder({
        customer: {
          ...formData,
          city: finalCity,
        },
        items: orderItems,
        subtotal,
        shippingFee,
        discountAmount,
        promoCode: appliedPromo || undefined,
        totalAmount,
        paymentMethod,
      });

      // Clear cart
      clearCart();

      // Redirect to Order Confirmation / WhatsApp Send Page
      router.push(`/order-success/${newOrder.id}`);
    } catch (err: any) {
      console.error('Error creating order', err);
      setErrorMsg('Something went wrong while placing your order. Please try again or WhatsApp us directly.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-pearl-50/60 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-pearl-300 text-[11px] font-mono uppercase tracking-wider text-gold-800 shadow-sm">
            <Lock className="w-3 h-3 text-gold-600" />
            <span>Frictionless Guest Checkout • No Account Required</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950">
            Delivery & Payment Details
          </h1>
          <p className="text-xs text-neutral-500">
            Provide your address below. We will confirm your order on WhatsApp ({settings.displayWhatsApp}) before dispatch.
          </p>
        </div>

        {/* Main Grid: Form (7 cols) + Order Summary (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Guest Customer Details Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-pearl-300 shadow-sm space-y-8">
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Section 1: Customer Contact */}
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900 mb-4 pb-2 border-b border-pearl-200 flex items-center gap-2">
                  <span>1. Contact & WhatsApp Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-neutral-700 block mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. Kamran Ali Khan"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-3.5 text-base sm:text-xs rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1.5">
                      WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      placeholder="0340 9797271 or +92 3XX XXXXXXX"
                      required
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-3.5 text-base sm:text-xs rounded-xl border border-pearl-300 focus:outline-none focus:border-emerald-600 bg-emerald-50/30 font-medium"
                    />
                    <span className="text-[10px] text-emerald-700 mt-1 block">
                      Used for order confirmation & tracking dispatch
                    </span>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1.5">
                      Alternate Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      placeholder="Secondary contact number"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-3.5 text-base sm:text-xs rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-neutral-700 block mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. yourname@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-3.5 text-base sm:text-xs rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Address */}
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900 mb-4 pb-2 border-b border-pearl-200 flex items-center gap-2">
                  <span>2. Delivery Address</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-neutral-700 block mb-1.5">
                      House / Street / Colony / Village Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="e.g. House 14, Street 3, Near Jamia Masjid, Main Bazar"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-3.5 text-base sm:text-xs rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-3.5 text-base sm:text-xs rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-white cursor-pointer"
                    >
                      {POPULAR_PAKISTANI_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.city === 'Other City' && (
                    <div>
                      <label className="font-semibold text-neutral-700 block mb-1.5">
                        Specify Your City Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter City Name"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        className="w-full p-3 sm:p-3.5 text-base sm:text-xs rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1.5">
                      Province / Territory <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-3.5 text-base sm:text-xs rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-white cursor-pointer"
                    >
                      <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa (KPK)</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Federal Capital">Islamabad Capital Territory</option>
                      <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                      <option value="Azad Kashmir">Azad Jammu & Kashmir (AJK)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-neutral-700 block mb-1.5">
                      Special Instructions / Cutting Notes (Optional)
                    </label>
                    <textarea
                      name="orderNotes"
                      rows={2}
                      placeholder="e.g. Call before delivery, gift packaging, urgent delivery date, etc."
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-3.5 text-base sm:text-xs rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Payment Method */}
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900 mb-4 pb-2 border-b border-pearl-200 flex items-center gap-2">
                  <span>3. Payment Method</span>
                </h3>

                <div className="space-y-3">
                  {/* Option 1: COD */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-amber-50/60 border-gold-500 ring-2 ring-gold-400/20 shadow-sm'
                        : 'bg-white border-pearl-300 hover:bg-pearl-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-gold-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-gold-700" />
                        <span className="font-serif font-bold text-sm text-neutral-900">
                          Cash on Delivery (COD) - Nationwide
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        Pay cash to courier upon inspecting the package at your doorstep.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Bank Transfer */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank-transfer'
                        ? 'bg-amber-50/60 border-gold-500 ring-2 ring-gold-400/20 shadow-sm'
                        : 'bg-white border-pearl-300 hover:bg-pearl-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank-transfer'}
                      onChange={() => setPaymentMethod('bank-transfer')}
                      className="mt-1 accent-gold-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-gold-700" />
                        <span className="font-serif font-bold text-sm text-neutral-900">
                          Direct Bank Transfer / EasyPaisa / JazzCash
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        Transfer to our official account and share receipt on WhatsApp.
                      </p>

                      {paymentMethod === 'bank-transfer' && (
                        <div className="mt-3 p-3 bg-white rounded-xl border border-pearl-300 text-xs space-y-1 font-mono text-neutral-700">
                          <div><strong>Account Title:</strong> {settings.bankDetails.accountTitle}</div>
                          <div><strong>Bank / Service:</strong> {settings.bankDetails.bankName}</div>
                          <div><strong>Account / EasyPaisa:</strong> {settings.bankDetails.accountNumber}</div>
                          <div><strong>IBAN:</strong> {settings.bankDetails.iban}</div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Right: Order Items & Price Summary (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-pearl-300 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif text-xl font-bold text-neutral-900 pb-3 border-b border-pearl-200">
              Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h3>

            {/* Items List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-pearl-100 pr-1 space-y-3">
              {cart.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-pearl-100 shrink-0 border border-pearl-200">
                    <Image
                      src={item.selectedColor.image || item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-xs">
                    <h4 className="font-serif font-semibold text-neutral-900 line-clamp-1">
                      {item.product.name}
                    </h4>
                    <div className="text-neutral-500 flex items-center gap-2 mt-0.5">
                      <span>{item.selectedColor.name}</span>
                      <span>•</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <div className="font-serif font-bold text-neutral-900 mt-1">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-pearl-200 pt-4 space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({appliedPromo || 'Coupon'})</span>
                  <span>-Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span className="font-semibold text-neutral-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">Free Delivery</span>
                  ) : (
                    `Rs. ${shippingFee.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-neutral-900 border-t border-pearl-200 pt-3 font-serif">
                <span>Total Payable</span>
                <span className="text-gold-700">Rs. {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-2xl font-serif text-sm font-bold uppercase tracking-widest text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                isSubmitting
                  ? 'bg-neutral-400 cursor-wait'
                  : 'bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950'
              }`}
            >
              {isSubmitting ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <span>Complete Order (Rs. {totalAmount.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </>
              )}
            </button>

            {/* Direct WhatsApp Notice */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                <span>Next Step: WhatsApp Confirmation</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                After clicking complete, you can send your order invoice directly to our WhatsApp (+92 340 9797271) with 1 click.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
