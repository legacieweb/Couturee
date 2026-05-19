import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, ShieldCheck, Lock, CreditCard, Smartphone } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import { PaystackButton } from 'react-paystack'

const Checkout = () => {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: 'Nairobi',
    phone: '',
    postalCode: ''
  })

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shipping = 500
  const total = subtotal + shipping

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async (reference) => {
    setLoading(true)
    
    try {
      const orderData = {
        user_id: user?.id || null,
        customer_name: formData.name,
        payment_reference: reference,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variantId: item.variantId,
          size: item.selectedSize,
          color: item.selectedColor
        })),
        total: total,
        shipping_details: formData
      }

      await api.createOrder(orderData)
      clearCart()
      navigate('/thank-you')
    } catch (error) {
      console.error('Failed to place order:', error)
      alert('Order recording failed. Please contact support with your payment reference: ' + reference)
    } finally {
      setLoading(false)
    }
  }

  const componentProps = {
    email: formData.email,
    amount: total * 100, // Paystack amount is in kobo/cents
    metadata: {
      name: formData.name,
      phone: formData.phone,
    },
    publicKey,
    text: "Complete Purchase",
    onSuccess: (reference) => handlePlaceOrder(reference.reference),
    onClose: () => alert("Transaction was not completed, window closed."),
  }

  if (cart.length === 0) {
    navigate('/cart')
    return null
  }

  const isFormValid = formData.name && formData.email && formData.address && formData.city && formData.phone;

  return (
    <div className="pt-40 pb-24 bg-white min-h-screen">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left: Forms */}
          <div className="lg:col-span-7 space-y-16">
            <div>
              <h1 className="text-4xl font-black elegant-font tracking-tighter uppercase mb-12">Checkout</h1>
              
              <form onSubmit={(e) => e.preventDefault()} className="space-y-16">
                {/* Contact Information */}
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif" 
                      />
                    </div>
                  </div>
                </section>

                {/* Shipping Details */}
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Shipping Destination</h3>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Delivery Address</label>
                      <input 
                        required 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Apartment, suite, etc." 
                        className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif" 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">City</label>
                        <input 
                          required 
                          type="text" 
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone (M-PESA)</label>
                        <input 
                          required 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="07XX XXX XXX" 
                          className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Postal Code</label>
                        <input 
                          type="text" 
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif" 
                        />
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
                        <CreditCard size={20} className="text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Paystack (Card/M-PESA)</span>
                      </div>
                      <div className="h-4 w-4 rounded-full border-4 border-primary" />
                    </div>
                  </div>
                  <div className="mt-8 p-6 bg-gray-50 flex items-start space-x-4">
                    <Info size={16} className="text-accent mt-1" />
                    <p className="text-xs text-gray-500 leading-relaxed font-serif italic">
                      Secure checkout via Paystack. Supports all major cards and M-PESA.
                    </p>
                  </div>
                </section>

                {isFormValid ? (
                  <PaystackButton 
                    {...componentProps}
                    className="w-full h-20 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-accent transition-all flex items-center justify-center space-x-4"
                  />
                ) : (
                  <button 
                    disabled
                    className="w-full h-20 bg-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-[0.4em] cursor-not-allowed flex items-center justify-center"
                  >
                    Please fill all shipping details
                  </button>
                )}
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
