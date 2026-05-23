import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, ShieldCheck, Lock, CreditCard, Smartphone, Check, Truck, MapPin } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import { PaystackButton } from 'react-paystack'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { AnimatePresence } from 'framer-motion'

const DELIVERY_LOCATIONS = [
  { city: 'Nairobi', fee: 100 },
  { city: 'Mombasa', fee: 200 },
  { city: 'Kisumu', fee: 200 },
  { city: 'Nakuru', fee: 200 },
  { city: 'Eldoret', fee: 200 },
  { city: 'Thika', fee: 200 },
  { city: 'Kiambu', fee: 200 },
  { city: 'Other (Rest of Kenya)', fee: 200 },
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
          <span className="text-primary">KSh {order?.total?.toLocaleString()}</span>
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
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [orderInfo, setOrderInfo] = useState(null)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState('delivery') // 'delivery' or 'pickup'
  const [paymentOption, setPaymentOption] = useState('full') // 'full', 'delivery_only', or 'deposit_50'
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: 'Nairobi',
    phone: '',
    postalCode: ''
  })

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shipping = deliveryMethod === 'pickup' ? 0 : (DELIVERY_LOCATIONS.find(l => l.city === formData.city)?.fee || 200)
  const orderTotal = subtotal + shipping
  
  // Logic for amount to pay based on method and option
  let amountToPay = 0
  let balanceDue = 0
  
  if (deliveryMethod === 'pickup') {
    amountToPay = subtotal * 0.5
    balanceDue = subtotal * 0.5
  } else {
    amountToPay = paymentOption === 'full' ? orderTotal : shipping
    balanceDue = paymentOption === 'full' ? 0 : subtotal
  }

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
    
    // Add branding
    try {
      // Add Logo instead of text
      const logoUrl = 'https://i.imgur.com/QPJRRvJ.png'
      const logo = await loadImage(logoUrl)
      doc.addImage(logo, 'PNG', 85, 10, 40, 20)
    } catch (error) {
      console.error('Failed to load logo:', error)
      doc.setFontSize(22)
      doc.text('Shabil KENYA', 105, 20, { align: 'center' })
      doc.setFontSize(10)
      doc.text('Luxury Fashion Archive', 105, 26, { align: 'center' })
    }
    
    // Order Info
    doc.setFontSize(12)
    doc.text(`Order Number: ${order.order_number}`, 20, 45)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 52)
    doc.text(`Customer: ${order.customer_name}`, 20, 59)
    doc.text(`Method: ${order.delivery_method === 'pickup' ? 'Store Pickup' : 'Doorstep Delivery'}`, 20, 66)
    if (order.delivery_method === 'pickup') {
      doc.setFontSize(8)
      doc.text(`Pickup at: Seasons, Kasarani, Nairobi`, 20, 70)
      doc.setFontSize(12)
    }
    doc.text(`Reference: ${order.payment_reference}`, 20, 77)
    
    // Table
    const tableData = order.items.map(item => [
      item.name,
      `${item.selectedSize} / ${item.selectedColor}`,
      item.quantity,
      `KSh ${item.price.toLocaleString()}`,
      `KSh ${(item.price * item.quantity).toLocaleString()}`
    ])
    
    doc.autoTable({
      startY: 85,
      head: [['Product', 'Variant', 'Qty', 'Price', 'Subtotal']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillStyle: '#000000' }
    })
    
    const finalY = doc.lastAutoTable.finalY || 75
    doc.text(`Shipping: KSh ${shipping.toLocaleString()}`, 140, finalY + 15)
    doc.setFontSize(14)
    doc.text(`Order Total: KSh ${order.total.toLocaleString()}`, 140, finalY + 25)
    doc.setFontSize(10)
    if (order.amount_paid < order.total) {
      doc.text(`Paid (Delivery Fee): KSh ${order.amount_paid?.toLocaleString()}`, 140, finalY + 32)
      doc.text(`Balance (COD): KSh ${order.balance_due?.toLocaleString()}`, 140, finalY + 38)
    } else {
      doc.text(`Paid In Full: KSh ${order.amount_paid?.toLocaleString()}`, 140, finalY + 32)
    }
    
    doc.save(`COUTUREE-ORDER-${order.order_number}.pdf`)
  }

  const handlePlaceOrder = async (reference) => {
    setPaymentProcessing(true)
    
    // Artificial delay for preloader as requested
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
        amount_paid: amountToPay,
        balance_due: balanceDue,
        payment_option: deliveryMethod === 'pickup' ? 'deposit_50' : paymentOption,
        delivery_method: deliveryMethod,
        shipping_details: deliveryMethod === 'pickup' ? { ...formData, address: 'Store Pickup (Kasarani Seasons)' } : formData,
        status: 'Processing'
      }

      const response = await api.createOrder(orderData)
      setOrderInfo(response)
      await generatePDF(response)
      clearCart()
      
      // Stop preloader before navigating or showing success
      setPaymentProcessing(false)
      
      if (user) {
        setShowSuccess(true)
      } else {
        // For guest users, go straight to thank you page
        navigate('/thank-you', { state: { order: response } })
      }
    } catch (error) {
      console.error('Failed to place order:', error)
      alert('Order recording failed. Please contact support with your payment reference: ' + reference)
      setPaymentProcessing(false)
    }
  }

  const componentProps = {
    email: formData.email,
    amount: amountToPay * 100, // Paystack amount is in kobo/cents
    currency: 'KES',
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

  const isFormValid = deliveryMethod === 'pickup' 
    ? formData.name && formData.email && formData.phone 
    : formData.name && formData.email && formData.address && formData.city && formData.phone;

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
          
          {/* Left: Forms */}
          <div className="lg:col-span-7 space-y-16">
            <div>
              <h1 className="text-4xl font-black elegant-font tracking-tighter uppercase mb-12">Checkout</h1>
              
              <form onSubmit={(e) => e.preventDefault()} className="space-y-16">
                {/* Delivery Method */}
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Delivery Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`p-6 border-2 flex flex-col items-start space-y-2 transition-all ${deliveryMethod === 'delivery' ? 'border-primary bg-primary/5' : 'border-gray-100'}`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest">Doorstep Delivery</span>
                      <span className="text-[8px] text-gray-400 uppercase tracking-widest">To your specified location</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`p-6 border-2 flex flex-col items-start space-y-2 transition-all ${deliveryMethod === 'pickup' ? 'border-primary bg-primary/5' : 'border-gray-100'}`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest">Store Pickup</span>
                      <span className="text-[8px] text-gray-400 uppercase tracking-widest">Kasarani, Seasons (50% Deposit)</span>
                    </button>
                  </div>
                </section>

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
                {deliveryMethod === 'delivery' ? (
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
                      
                      {/* Delivery Fees Guide */}
                      <div className="mt-8 p-6 bg-gray-50/50 border border-gray-100 space-y-4">
                        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                          <Truck size={14} className="text-accent" />
                          <span>Delivery Registry & Rates</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {DELIVERY_LOCATIONS.map(loc => (
                            <div key={loc.city} className="flex flex-col">
                              <span className="text-[8px] font-bold uppercase text-gray-400">{loc.city}</span>
                              <span className="text-[10px] font-black">KSh {loc.fee}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                ) : (
                  <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Pickup Location</h3>
                    <div className="p-8 bg-gray-50 border border-gray-100 space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white rounded-full">
                          <MapPin size={20} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Shabil Atelier (Seasons)</p>
                          <p className="text-sm font-serif italic text-gray-500">Kasarani, Seasons, Nairobi, Kenya</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">Operating Hours: Mon-Sat, 9AM - 6PM</p>
                      </div>
                    </div>
                    <div className="mt-8 space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact Phone (M-PESA)</label>
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
                  </section>
                )}

                {/* Payment Method */}
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

                {/* Payment Options */}
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Payment Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {deliveryMethod === 'delivery' ? (
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
                    ) : (
                      <div className="col-span-2 p-6 border-2 border-primary bg-primary/5 flex flex-col items-start space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest">50% Commitment Deposit</span>
                        <span className="text-[8px] text-gray-400 uppercase tracking-widest">Required for store pickup orders. Pay balance at the atelier.</span>
                      </div>
                    )}
                  </div>
                </section>

                {isFormValid ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-accent/5 border border-accent/10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Payment Summary</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Due Now</span>
                        <span className="text-xl font-black">KSh {amountToPay.toLocaleString()}</span>
                      </div>
                      {balanceDue > 0 && (
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-accent/10">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {deliveryMethod === 'pickup' ? 'Balance at Pickup' : 'Balance on Delivery'}
                          </span>
                          <span className="text-sm font-bold">KSh {balanceDue.toLocaleString()}</span>
                        </div>
                      )}
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
                  <span>KSh {orderTotal.toLocaleString()}</span>
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
