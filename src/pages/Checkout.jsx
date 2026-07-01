import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, CreditCard, Check, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import { PaystackButton } from 'react-paystack'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { AnimatePresence } from 'framer-motion'

const DELIVERY_LOCATIONS = [
  { city: 'Nairobi', fee: 5, country: 'kenya' },
  { city: 'Mombasa', fee: 10, country: 'kenya' },
  { city: 'Kisumu', fee: 10, country: 'kenya' },
  { city: 'Nakuru', fee: 10, country: 'kenya' },
  { city: 'Eldoret', fee: 10, country: 'kenya' },
  { city: 'Thika', fee: 10, country: 'kenya' },
  { city: 'Kiambu', fee: 10, country: 'kenya' },
  { city: 'Other (Rest of Kenya)', fee: 10, country: 'kenya' },
]

const INTERNATIONAL_LOCATIONS = [
  { country: 'USA', fee: 19, shippingTime: '7-10 days' },
  { country: 'UK', fee: 19, shippingTime: '7-10 days' },
  { country: 'Canada', fee: 19, shippingTime: '7-10 days' },
  { country: 'Japan', fee: 22, shippingTime: '10-14 days' },
  { country: 'South Africa', fee: 15, shippingTime: '5-7 days' },
]

const Preloader = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
  >
    <div className="w-24 h-[1px] bg-gray-100 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-primary"
        animate={{ 
          x: ['-100%', '100%'],
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </div>
    <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.4em] text-primary animate-pulse">
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
        <div className="bg-gray-50 p-6 space-y-3">
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
  const [paymentOption, setPaymentOption] = useState('full')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: 'Nairobi',
    country: 'kenya',
    phone: '',
    postalCode: ''
  })
  
  const getShippingTime = () => {
    const isIntl = formData.country && formData.country !== 'kenya'
    if (isIntl) {
      // For international, get shipping time from product data or use defaults
      if (cart.length > 0) {
        const productShippingTimes = cart.map(item => {
          const countryKey = formData.country?.toLowerCase()
          if (item.shippingTime && item.shippingTime[countryKey]) {
            return item.shippingTime[countryKey]
          }
          // Fallback to default international shipping
          return null
        }).filter(Boolean)
        
        if (productShippingTimes.length > 0) {
          // Get the longest shipping time (most conservative estimate) based on numeric comparison
          const timeNumbers = productShippingTimes.map(time => {
            const match = time.match(/(\d+)/)
            return match ? parseInt(match[1]) : 0
          })
          const maxTime = Math.max(...timeNumbers)
          return productShippingTimes[timeNumbers.indexOf(maxTime)]
        }
      }
      // Default international shipping times
      const intlLocation = INTERNATIONAL_LOCATIONS.find(l => l.country.toLowerCase() === formData.country)
      return intlLocation?.shippingTime || '7-10 days'
    }
    
    // For domestic Kenya - get shipping time from product data based on city
    if (cart.length > 0) {
      const productShippingTimes = cart.map(item => {
        const cityKey = formData.city?.toLowerCase()
        if (item.shippingTime && item.shippingTime[cityKey]) {
          return item.shippingTime[cityKey]
        }
        // Check for kenya key if city-specific not found
        if (item.shippingTime && item.shippingTime.kenya) {
          return item.shippingTime.kenya
        }
        return null
      }).filter(Boolean)
      
      if (productShippingTimes.length > 0) {
        const timeNumbers = productShippingTimes.map(time => {
          const match = time.match(/(\d+)/)
          return match ? parseInt(match[1]) : 0
        })
        const maxTime = Math.max(...timeNumbers)
        return productShippingTimes[timeNumbers.indexOf(maxTime)]
      }
    }
    
    return '2-3 Business Days'
  }
  const isInternational = formData.country && formData.country !== 'kenya'
  
  let baseShippingFee = 0
  if (isInternational) {
    const intlLocation = INTERNATIONAL_LOCATIONS.find(l => l.country.toLowerCase() === formData.country)
    baseShippingFee = intlLocation ? intlLocation.fee : 19
  } else {
    baseShippingFee = DELIVERY_LOCATIONS.find(l => l.city === formData.city)?.fee || 10
  }

  const shipping = isInternational ? Math.round(baseShippingFee * 1.10) : baseShippingFee

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const orderTotal = subtotal + shipping
  const amountToPay = paymentOption === 'full' ? orderTotal : shipping
  const balanceDue = paymentOption === 'full' ? 0 : subtotal

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  };

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
    if (order.shipping_time) {
      doc.text(`Estimated Shipping: ${order.shipping_time}`, 20, 84)
    }
    
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
    doc.text(`Shipping: $ ${shipping.toLocaleString()}`, 140, finalY + 15)
    doc.setFontSize(14)
    doc.text(`Order Total: $ ${order.total.toLocaleString()}`, 140, finalY + 25)
    doc.setFontSize(10)
    if (order.amount_paid < order.total) {
      doc.text(`Paid (Delivery Fee): $ ${(order.amount_paid || 0).toLocaleString()}`, 140, finalY + 32)
      doc.text(`Balance (COD): $ ${(order.balance_due || 0).toLocaleString()}`, 140, finalY + 38)
    } else {
      doc.text(`Paid In Full: $ ${(order.amount_paid || 0).toLocaleString()}`, 140, finalY + 32)
    }
    
    doc.save(`COUTUREE-ORDER-${order.order_number}.pdf`)
  }

  const handlePlaceOrder = async (reference) => {
    setPaymentProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      const shippingTime = getShippingTime()
      
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
        amount_paid: amountToPay,
        balance_due: balanceDue,
        currency: 'USD',
        payment_option: paymentOption,
        delivery_method: 'delivery',
        shipping_time: shippingTime,
        shipping_details: formData,
        status: 'Processing'
      }

      const response = await api.createOrder(orderData)
      setOrderInfo(response)
      await generatePDF(response)
      clearCart()

      setPaymentProcessing(false)

      if (user) {
        setShowSuccess(true)
      } else {
        navigate('/thank-you', { state: { order: response } })
      }
    } catch (error) {
      console.error('Failed to place order:', error)
      alert('Order recording failed. Please contact support with your payment reference: ' + reference)
      setPaymentProcessing(false)
    }
  }

  const displayAmount = amountToPay
  const displayCurrency = '$'
  const paystackCurrency = 'USD'
  const paystackAmount = amountToPay * 100

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

  const isFormValid = formData.name && formData.email && formData.address && formData.phone && (formData.country === 'kenya' ? formData.city : formData.country);

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          <div className="lg:col-span-7 space-y-16">
            <div>
              <h1 className="text-4xl font-black elegant-font tracking-tighter uppercase mb-12">Checkout</h1>
              
              <form onSubmit={(e) => e.preventDefault()} className="space-y-16">
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
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Country</label>
                        <select 
                          required 
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-accent font-serif bg-transparent" 
                        >
                          <option value="kenya">Kenya (Domestic)</option>
                          <option value="usa">USA</option>
                          <option value="uk">UK</option>
                          <option value="canada">Canada</option>
                          <option value="japan">Japan</option>
                          <option value="southafrica">South Africa</option>
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
                            {DELIVERY_LOCATIONS.map(loc => (
                              <option key={loc.city} value={loc.city}>{loc.city}</option>
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
                    
                    <div className="mt-8 p-6 bg-gray-50/50 border border-gray-100 space-y-4">
                      <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                        <Truck size={14} className="text-accent" />
                        <span>Delivery Registry & Rates</span>
                      </div>
                      
{(() => {
                        const shippingTime = getShippingTime()
                        return (
                          <div className="mb-4 p-4 bg-white border border-accent/20">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-accent mb-1">Estimated Shipping Time</p>
                            <p className="text-sm font-serif font-medium">{shippingTime}</p>
                          </div>
                        )
                      })()}
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {DELIVERY_LOCATIONS.map(loc => (
                          <div key={loc.city} className="flex flex-col">
                            <span className="text-[8px] font-bold uppercase text-gray-400">{loc.city}</span>
                            <span className="text-[10px] font-black">$ {loc.fee}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">International Shipping (10% Processing Fee)</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {INTERNATIONAL_LOCATIONS.map(loc => (
                            <div key={loc.country} className="flex flex-col">
                              <span className="text-[8px] font-bold uppercase text-gray-400">{loc.country}</span>
                              <span className="text-[10px] font-black">$ {Math.round(loc.fee * 1.10)}</span>
                              <span className="text-[8px] text-gray-400">{loc.shippingTime}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                  
                <section>
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Payment Method</h3>
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
                     <Info size={16} className="text-accent mt-1" />
                     <p className="text-xs text-gray-500 leading-relaxed font-serif italic">
                       Secure checkout. Supports all major cards and M-PESA.
                     </p>
                   </div>
                 </section>
                  
                 <section>
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Payment Options</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <>
                       <button 
                         type="button"
                         onClick={() => setPaymentOption('full')}
                         className={`p-6 border-2 flex flex-col items-start space-y-2 transition-all ${paymentOption === 'full' ? 'border-primary bg-primary/5' : 'border-gray-100'}`}
                       >
                         <span className="text-[10px] font-bold uppercase tracking-widest">Pay Full Amount</span>
                         <span className="text-[8px] text-gray-400 uppercase tracking-widest">Complete purchase now</span>
                       </button>
                       <button 
                         type="button"
                         onClick={() => setPaymentOption('delivery_only')}
                         className={`p-6 border-2 flex flex-col items-start space-y-2 transition-all ${paymentOption === 'delivery_only' ? 'border-primary bg-primary/5' : 'border-gray-100'}`}
                       >
                         <span className="text-[10px] font-bold uppercase tracking-widest">Pay Delivery Fee Only</span>
                         <span className="text-[8px] text-gray-400 uppercase tracking-widest">Balance on delivery (COD)</span>
                       </button>
                     </>
                   </div>
                 </section>

                 {isFormValid ? (
                   <div className="space-y-6">
                     <div className="p-6 bg-accent/5 border border-accent/10">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Payment Summary</p>
                       <div className="flex justify-between items-center">
                         <span className="text-sm font-medium">Due Now</span>
                         <span className="text-xl font-black">$ {displayAmount.toLocaleString()}</span>
                       </div>
                     </div>
                     <PaystackButton 
                       {...componentProps}
                       className="w-full h-20 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-accent transition-all flex items-center justify-center space-x-4"
                     />
                   </div>
                 ) : (
                   <button 
                     disabled
                     className="w-full h-20 bg-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-[0.4em] cursor-not-allowed flex items-center justify-center"
                   >
                     Please fill all required fields
                   </button>
                 )}
              </form>
            </div>
          </div>

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
                      <p className="text-sm font-bold mt-2">$ {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-12 border-t border-gray-200 space-y-4">
                <div className="flex justify-between text-xs font-serif italic text-gray-500">
                  <span>Subtotal (USD)</span>
                  <span>$ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-serif italic text-gray-500">
                  <span>Shipping (USD)</span>
                  <span>$ {shipping.toLocaleString()}</span>
                </div>
{(() => {
                    const shippingTime = getShippingTime()
                    return (
                      <div className="flex justify-between text-xs font-serif">
                        <span className="text-accent font-bold uppercase tracking-widest">Estimated Delivery</span>
                        <span className="text-primary font-medium">{shippingTime}</span>
                      </div>
                    )
                  })()}
                <div className="flex justify-between pt-6 text-xl font-black elegant-font uppercase tracking-tighter">
                  <span>Total (USD)</span>
                  <span>$ {orderTotal.toLocaleString()}</span>
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