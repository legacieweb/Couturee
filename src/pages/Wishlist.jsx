import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, ArrowUpRight, X, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart()

  const handleMoveToBag = (product) => {
    // Default to first variant for quick move
    if (product.variants && product.variants.length > 0) {
      addToCart(product, product.variants[0], 1)
      toggleWishlist(product) // Remove from wishlist after adding to bag
    }
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 pt-40">
        <Heart size={64} className="text-gray-100 mb-8" />
        <h2 className="text-3xl font-black elegant-font tracking-tighter uppercase mb-4 text-center">Your Wishlist is Empty</h2>
        <p className="text-gray-500 text-sm mb-12 text-center max-w-xs font-serif italic">"True style is found in the pieces we dream of."</p>
        <Link to="/products" className="bg-primary text-white h-14 px-12 text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center">
          Explore Collections
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-40 pb-24 bg-white min-h-screen">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-gray-100 pb-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mb-4 block">Personal Curation</span>
            <h1 className="text-6xl md:text-8xl font-black elegant-font tracking-tighter uppercase leading-none">Wishlist</h1>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-6 md:mt-0 italic">
            {wishlist.length} {wishlist.length === 1 ? 'Piece' : 'Pieces'} Saved
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          <AnimatePresence mode="popLayout">
            {wishlist.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-8 bg-gray-50">
                  <Link to={`/product/${product.id}`}>
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                    />
                  </Link>
                  
                  {/* Quick Remove */}
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-6 right-6 h-10 w-10 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-full hover:bg-white transition-all shadow-sm"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>

                  {/* Add to Bag Overlay */}
                  <button 
                    onClick={() => handleMoveToBag(product)}
                    className="absolute bottom-0 left-0 w-full h-16 bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex items-center justify-center space-x-3"
                  >
                    <ShoppingBag size={14} />
                    <span>Move to Bag</span>
                  </button>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-accent mb-2">{product.category}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-3xl font-black elegant-font tracking-tighter leading-none group-hover:text-accent transition-colors uppercase">{product.name}</h3>
                    </Link>
                    <p className="text-sm font-bold mt-3 italic font-serif">KSh {product.price.toLocaleString()}</p>
                  </div>
                  <Link 
                    to={`/product/${product.id}`}
                    className="h-12 w-12 border border-gray-100 flex items-center justify-center rounded-full hover:bg-gray-50 transition-all"
                  >
                    <ArrowUpRight size={18} strokeWidth={1.5} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Wishlist
