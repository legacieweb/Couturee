import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const navigate = useNavigate()

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shipping = cart.length > 0 ? 500 : 0
  const total = subtotal + shipping

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 pt-40">
        <ShoppingBag size={64} className="text-gray-100 mb-8" />
        <h2 className="text-3xl font-bold elegant-font tracking-tighter uppercase mb-4 text-center">Your Collection is Empty</h2>
        <p className="text-gray-500 text-sm mb-12 text-center max-w-xs">It seems you haven't added any elegant pieces to your collection yet.</p>
        <Link to="/products" className="bg-primary text-white h-14 px-12 text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center">
          Browse Collections
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-40 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-12">
        <h1 className="text-4xl font-bold elegant-font tracking-tighter uppercase mb-12 border-b border-gray-200 pb-8">Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            {cart.map((item) => (
              <div key={`${item.id}-${item.variantId}`} className="bg-white p-8 border border-gray-100 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 hover:shadow-xl transition-shadow duration-500 group">
                <div className="w-full md:w-32 aspect-[3/4] bg-gray-100 overflow-hidden flex-shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-primary uppercase mb-2 group-hover:text-accent transition-colors">{item.name}</h3>
                      <div className="flex space-x-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <span>Color: <span className="text-primary">{item.selectedColor}</span></span>
                        <span>Size: <span className="text-primary">{item.selectedSize}</span></span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.variantId)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end mt-8">
                    <div className="flex items-center border border-gray-100 h-10 w-24">
                      <button 
                        onClick={() => updateQuantity(item.id, item.variantId, -1)}
                        className="flex-1 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={12} strokeWidth={1.5} />
                      </button>
                      <span className="flex-1 text-center text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.variantId, 1)}
                        className="flex-1 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={12} strokeWidth={1.5} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-primary italic">KSh {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-10 border border-gray-100 shadow-sm sticky top-40">
              <h3 className="text-lg font-bold elegant-font tracking-tighter uppercase mb-8 pb-4 border-b border-gray-50">Order Summary</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium italic">Subtotal</span>
                  <span className="font-bold">KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium italic">Estimated Shipping (Nairobi)</span>
                  <span className="font-bold">KSh {shipping.toLocaleString()}</span>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Total Amount</span>
                  <span className="text-xl font-bold tracking-tight">KSh {total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full h-16 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent transition-all transform hover:-translate-y-1 flex items-center justify-center group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <p className="text-[10px] text-gray-400 mt-6 text-center italic">Payment processed via M-PESA, Visa, or Mastercard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
