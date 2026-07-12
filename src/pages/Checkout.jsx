import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Lock, CreditCard, Check, Package, Globe, Truck, Clock, ChevronRight, Loader2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import { PaystackButton } from 'react-paystack'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const COUNTRY_LIST = [
  { value: 'kenya', label: 'Kenya (Domestic)', flag: '🇰🇪' },
  { value: 'usa', label: 'United States', flag: '🇺🇸' },
  { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'canada', label: 'Canada', flag: '🇨🇦' },
  { value: 'japan', label: 'Japan', flag: '🇯🇵' },
  { value: 'southafrica', label: 'South Africa', flag: '🇿🇦' }
]

const SmoothCounter = ({ target, prefix = '', suffix = '' }) => {
  const [display, setDisplay] = useState('0')
  useEffect(() => {
    const num = parseInt(target) || 0
    let start = 0
    const duration = 800
    const startTime = performance.now()
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(start + (num - start) * eased)
      setDisplay(String(current))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target])
  return <span>{prefix}{display}{suffix}</span>
}

const Preloader = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
  >
    <div className="w-24 h-[1px] bg-gray-100 relative overflow-hidden mb-8">
      <motion.div 
        className="absolute inset-0 bg-primary"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary animate-pulse">
      Securing Your Pieces
    </p>
  </motion.div>
)

const SuccessPopup = ({ order, onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
  >
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className="bg-white max-w-lg w-full p-12 text-center space-y-8"
    >
      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
        <Check className="text-white" size={40} />
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-black elegant-font uppercase tracking-tighter">Order Secured</h2>
        <p className="text-sm font-serif italic text-gray-500">
          Your pieces have been archived. A digital receipt has been downloaded to your device.
        </p>
      </div>
      <div className="py-8 border-y border-gray-100 space-y-4">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <span>Order Number</span>
          <span className="text-primary">{order?.order_number}</span>
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <span>Amount Paid</span>
          <span className="text-primary">$ {order?.total ? order.total.toLocaleString() : '0'}</span>
        </div>
      </div>
      {!localStorage.getItem('shabil_user') && (
        <div className="bg-gray-50 p-6 space-y-3 text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Guest Order</p>
          <p className="text-[9px] text-gray-500 leading-relaxed">
            Create an account later using your Order Number to track this shipment.
          </p>
        </div>
      )}
      <button 
        onClick={onClose}
        className="w-full h-16 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-accent transition-all"
      >
        Continue
      </button>
    </motion.div>
  </motion.div>
)

const Checkout = () => {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)
  const [orderInfo, setOrderInfo] = useState(null)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [shippingData, setShippingData] = useState(null)
  const [shippingLoading, setShippingLoading] = useState(false)
  const [shippingError, setShippingError] = useState('')
  const [shippingCache, setShippingCache] = useState({})
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: 'Nairobi',
    country: 'kenya',
    phone: ''
  })

  useEffect(() => { setMounted(true) }, [])

  const fetchShippingTime = useCallback(async (country) => {
    if (shippingCache[country]) {
      setShippingData(shippingCache[country])
      setShippingError('')
      return
    }
    setShippingLoading(true)
    setShippingError('')
    try {
      const response = await api.getShippingTime(country)
      const data = response.data
      setShippingData(data)
      setShippingCache(prev => ({ ...prev, [country]: data }))
    } catch (err) {
      console.error('Failed to fetch shipping time:', err)
      setShippingError('Unable to fetch shipping details. Please try again.')
      setShippingData(null)
    } finally {
      setShippingLoading(false)
    }
  }, [shippingCache])

  useEffect(() => {
    if (formData.country && mounted) {
      fetchShippingTime(formData.country)
    }
  }, [formData.country, fetchShippingTime, mounted])

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shippingCostRaw = shippingData?.cost || '$0'
  const shippingTime = shippingData?.shippingTime || ''
  const shippingCostValue = parseFloat(shippingCostRaw.replace(/[^0-9.]/g, '')) || 0
  const orderTotal = subtotal + shippingCostValue

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => resolve(img)
      img.onerror = (e) => reject(e)
      img.src = url
    })
  }

  const generatePDF = async (order) => {
    const doc = new jsPDF()
    try {
      const logoUrl = 'https://i.imgur.com/QPJRRvJ.png'
      const logo = await loadImage(logoUrl)
      doc.addImage(logo, 'PNG', 85, 10, 40, 20)
    } catch (error) {
      console.error('Failed to load logo:', error)
      doc.setFontSize(22)
      doc.text('Shabil', 105, 20, { align: 'center' })
      doc.setFontSize(10)
      doc.text('Luxury Fashion', 105, 26, { align: 'center' })
    }
    doc.setFontSize(12)
    doc.text(`Order Number: ${order.order_number}`, 20, 45)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 52)
    doc.text(`Customer: ${order.customer_name}`, 20, 59)
    doc.text(`Method: Doorstep Delivery`, 20, 66)
    doc.text(`Reference: ${order.payment_reference}`, 20, 77)
    doc.text(`Estimated Shipping: ${shippingData?.shippingTime || 'Calculating'}`, 20, 84)
    const tableData = order.items.map(item => [
      item.name,
      `${item.selectedSize} / ${item.selectedColor}`,
      item.quantity,
      `$ ${item.price.toLocaleString()}`,
      `$ ${(item.price * item.quantity).toLocaleString()}`
    ])
    doc.autoTable({
      startY: 85,
      head: [['Product', 'Variant', 'Qty', 'Price', 'Subtotal']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillStyle: '#000000' }
    })
    const finalY = doc.lastAutoTable.finalY || 75
    doc.setFontSize(14)
    doc.text(`Order Total: $ ${order.total.toLocaleString()}`, 140, finalY + 15)
    doc.save(`COUTUREE-ORDER-${order.order_number}.pdf`)
  }

  const handlePlaceOrder = async (reference) => {
    setPaymentProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
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
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor
        })),
        total: orderTotal,
        amount_paid: orderTotal,
        balance_due: 0,
        payment_option: 'full',
        delivery_method: 'delivery',
        shipping_details: { ...formData, shipping_time: shippingData?.shippingTime }
      }
      const response = await api.createOrder(orderData)
      const orderWithShipping = { ...response, shipping_time: shippingData?.shippingTime }
      setOrderInfo(orderWithShipping)
      await generatePDF(orderWithShipping)
      clearCart()
      setPaymentProcessing(false)
      if (user) {
        setShowSuccess(true)
      } else {
        navigate('/thank-you', { state: { order: orderWithShipping } })
      }
    } catch (error) {
      console.error('Failed to place order:', error)
      alert('Order recording failed. Please contact support with your payment reference: ' + reference)
      setPaymentProcessing(false)
    }
  }

  const displayAmount = orderTotal
  const paystackCurrency = 'USD'
  const paystackAmount = orderTotal * 100

  const componentProps = {
    email: formData.email,
    amount: paystackAmount,
    currency: paystackCurrency,
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

  const isFormValid = formData.name && formData.email && formData.address && formData.phone && (formData.country === 'kenya' ? formData.city : formData.country)

  return (
    <div className="pt-40 pb-24 bg-white min-h-screen">
      <AnimatePresence>
        {paymentProcessing && <Preloader />}
        {showSuccess && (
          <SuccessPopup 
            order={orderInfo} 
            onClose={() => {
              setShowSuccess(false)
              navigate('/thank-you', { state: { order: orderInfo } })
            }} 
          />
        )}
      </AnimatePresence>
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mb-6 block"
          >
            Secure Checkout
          </motion.span>
          <h1 className="text-5xl md:text-7xl font-black elegant-font tracking-tighter uppercase leading-[0.9]">
            Finalize<br />
            <span className="italic font-normal serif lowercase ml-[10vw]">Your Order</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-7 space-y-16">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-16">
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-10">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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

              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-10">Shipping Destination</h3>
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
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Country</label>
                      <select 
                        required 
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif bg-transparent" 
                      >
                        {COUNTRY_LIST.map(c => (
                          <option key={c.value} value={c.value}>{c.flag} {c.label}</option>
                        ))}
                      </select>
                    </div>
                    {formData.country === 'kenya' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">City / Region</label>
                        <select 
                          required 
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif bg-transparent" 
                        >
                          {shippingData?.regions?.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone</label>
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
                  </div>

                  <AnimatePresence mode="wait">
                    {shippingError && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-[10px] text-accent font-bold uppercase tracking-widest"
                      >
                        {shippingError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-10">Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 border-2 border-primary flex items-center justify-between cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <CreditCard size={20} className="text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Card/M-PESA</span>
                    </div>
                    <div className="h-4 w-4 rounded-full border-4 border-primary" />
                  </div>
                </div>
                <div className="mt-8 p-6 bg-gray-50 flex items-start space-x-4">
                  <div className="text-accent mt-0.5">
                    <ShieldCheck size={18} />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-serif italic">
                    Secure checkout. Supports all major cards and M-PESA.
                  </p>
                </div>
              </section>

              {isFormValid && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="p-6 bg-accent/5 border border-accent/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Payment Summary</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Due</span>
                      <span className="text-xl font-black">$ {displayAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <PaystackButton 
                    {...componentProps}
                    className="w-full h-20 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-accent transition-all flex items-center justify-center space-x-4"
                  />
                </motion.div>
              )}
              {!isFormValid && (
                <button 
                  disabled
                  className="w-full h-20 bg-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-[0.4em] cursor-not-allowed flex items-center justify-center"
                >
                  Please fill all required fields
                </button>
              )}
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-40 space-y-8">
<motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-gray-50 p-10 md:p-14 space-y-10"
               >
                 <div>
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Order Archive</h3>
                   <div className="space-y-6 max-h-[320px] overflow-y-auto pr-4 custom-scrollbar">
                     {cart.map((item) => {
                       const countryKey = formData.country === 'southafrica' ? 'southAfrica' : formData.country
                       const productShippingTime = formData.country === 'kenya' 
                         ? item.shippingTime?.kenya || shippingData?.shippingTime
                         : item.shippingTime?.[countryKey] || item.shippingTime?.kenya
                       return (
                       <div key={`${item.id}-${item.variantId}`} className="flex space-x-5 pb-4 border-b border-gray-100 last:border-0">
                         <div className="h-20 w-16 bg-white flex-shrink-0">
                           <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover grayscale" />
                         </div>
                         <div className="flex-grow flex flex-col justify-center">
                           <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 leading-tight">{item.name}</h4>
                           <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Size {item.selectedSize} / {item.selectedColor} x {item.quantity}</p>
                           {productShippingTime && (
                             <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-accent mb-1">Est. Delivery: {productShippingTime}</p>
                           )}
                           <p className="text-xs font-black elegant-font">$ {(item.price * item.quantity).toLocaleString()}</p>
                         </div>
                       </div>
                       )
                     })}
                   </div>
                 </div>

                <div className="space-y-5">
                  <div className="flex justify-between text-xs font-serif italic text-gray-500">
                    <span>Subtotal</span>
                    <span>$ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-serifitalic text-gray-500">
                    <span>Shipping</span>
                    <span className="text-primary font-medium">{shippingData?.cost || 'Calculating...'}</span>
                  </div>
                  <div className="h-[1px] bg-gray-200" />
                  <div className="flex justify-between pt-4 text-2xl font-black elegant-font uppercase tracking-tighter">
                    <span>Total</span>
                    <span>$ {displayAmount.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {shippingLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-primary text-white p-10 md:p-14 space-y-6"
                  >
                    <div className="flex items-center space-x-4">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Calculating Delivery</span>
                    </div>
                    <p className="text-xs font-serif italic text-white/70">
                      Fetching the most accurate delivery estimate for your destination...
                    </p>
                  </motion.div>
                )}

                {!shippingLoading && shippingData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-primary text-white p-10 md:p-14 space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Delivery To</h3>
                      <span className="text-2xl">{COUNTRY_LIST.find(c => c.value === formData.country)?.flag}</span>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-5">
                        <Globe size={20} className="text-accent mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-3xl font-black elegant-font tracking-tighter">{shippingData.country}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mt-1">
                            {formData.country === 'kenya' && formData.city ? formData.city : 'International'}
                          </p>
                        </div>
                      </div>
                      <div className="h-[1px] bg-white/10" />
                      <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-start space-x-4">
                          <Truck size={18} className="text-accent mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Shipping Cost</p>
                            <p className="text-lg font-black elegant-font tracking-tight">{shippingData.cost}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <Clock size={18} className="text-accent mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Est. Delivery</p>
                            <p className="text-lg font-black elegant-font tracking-tight">{shippingData.shippingTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.div 
                      className="flex items-center space-x-3 pt-4 border-t border-white/10 cursor-pointer group"
                      whileHover={{ x: 5 }}
                    >
                      <Package size={14} className="text-accent" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60 group-hover:text-accent transition-colors">
                        Full Shipping Policy
                      </span>
                      <ChevronRight size={12} className="text-accent" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-8 space-y-5">
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

export default Checkout