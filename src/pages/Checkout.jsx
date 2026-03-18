import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, ShieldCheck, Lock, CreditCard, Smartphone } from 'lucide-react'
import { useCart } from '../context/CartContext'

const Checkout = () => {
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shipping = 500
  const total = subtotal + shipping

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      clearCart()
      navigate('/thank-you')
    }, 2000)
  }

  if (cart.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="pt-40 pb-24 bg-white min-h-screen">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left: Forms */}
          <div className="lg:col-span-7 space-y-16">
            <div>
              <h1 className="text-4xl font-black elegant-font tracking-tighter uppercase mb-12">Checkout</h1>
              
              <form onSubmit={handlePlaceOrder} className="space-y-16">
                {/* Contact Information */}
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                      <input required type="text" className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                      <input required type="email" className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif" />
                    </div>
                  </div>
                </section>

                {/* Shipping Details */}
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Shipping Destination</h3>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Delivery Address</label>
                      <input required type="text" placeholder="Apartment, suite, etc." className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">City</label>
                        <input required type="text" defaultValue="Nairobi" className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone (M-PESA)</label>
                        <input required type="tel" placeholder="07XX XXX XXX" className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Postal Code</label>
                        <input type="text" className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Payment Method */}
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 border-2 border-primary flex items-center justify-between cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <Smartphone size={20} className="text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">M-PESA</span>
                      </div>
                      <div className="h-4 w-4 rounded-full border-4 border-primary" />
                    </div>
                    <div className="p-6 border border-gray-100 flex items-center justify-between cursor-pointer opacity-50">
                      <div className="flex items-center space-x-4">
                        <CreditCard size={20} className="text-gray-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Card</span>
                      </div>
                      <div className="h-4 w-4 rounded-full border border-gray-200" />
                    </div>
                  </div>
                  <div className="mt-8 p-6 bg-gray-50 flex items-start space-x-4">
                    <Info size={16} className="text-accent mt-1" />
                    <p className="text-xs text-gray-500 leading-relaxed font-serif italic">
                      You will receive an M-PESA prompt on your phone once you click "Complete Purchase". Please have your phone ready.
                    </p>
                  </div>
                </section>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full h-20 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-accent transition-all flex items-center justify-center space-x-4 disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Purchase</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-40 bg-gray-50 p-10 md:p-16 space-y-12">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Order Archive</h3>
              
              <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.variantId}`} className="flex space-x-6">
                    <div className="h-24 w-20 bg-white flex-shrink-0">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover grayscale" />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{item.name}</h4>
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">Size {item.selectedSize} / {item.selectedColor} x {item.quantity}</p>
                      <p className="text-sm font-bold mt-2">KSh {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-12 border-t border-gray-200 space-y-4">
                <div className="flex justify-between text-xs font-serif italic text-gray-500">
                  <span>Subtotal</span>
                  <span>KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-serif italic text-gray-500">
                  <span>Shipping</span>
                  <span>KSh {shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-6 text-xl font-black elegant-font uppercase tracking-tighter">
                  <span>Total</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-12 space-y-6">
                <div className="flex items-center space-x-4 text-gray-400">
                  <ShieldCheck size={18} />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Encrypted Checkout</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-400">
                  <Lock size={18} />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Secure Data Processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Info = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

export default Checkout
