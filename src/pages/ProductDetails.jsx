import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products } from '../data/products'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Ruler, Truck, ShieldCheck, Heart, Minus, Plus, Share2, Info, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'

const ProductDetails = () => {
  const { id } = useParams()
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState('details')
  const [addedToCart, setAddedToCart] = useState(false)

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id))
    if (foundProduct) {
      setProduct(foundProduct)
      if (foundProduct.variants.length > 0) {
        setSelectedSize(foundProduct.variants[0].size)
        setSelectedColor(foundProduct.variants[0].color)
      }
    }
  }, [id])

  if (!product) return null

  const currentVariant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor)
  const inStock = currentVariant ? currentVariant.stock > 0 : false
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3)

  const handleAddToCart = () => {
    if (inStock && currentVariant) {
      addToCart(product, currentVariant, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  return (
    <div className="bg-white pt-32">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left: Image Carousel */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Navigation Arrows */}
              <button 
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 backdrop-blur-md flex items-center justify-center rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-primary"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 backdrop-blur-md flex items-center justify-center rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-primary"
              >
                <ChevronRight size={24} />
              </button>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                <motion.div 
                  className="h-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${((selectedImage + 1) / product.images.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-[3/4] overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-accent scale-95' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} alt={`${product.name} thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info (Sticky) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32 space-y-12">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mb-4 block">Signature Collection</span>
                    <h1 className="text-5xl font-black elegant-font tracking-tighter leading-[0.9] uppercase">{product.name}</h1>
                  </div>
                  <button className="h-12 w-12 border border-gray-100 flex items-center justify-center rounded-full hover:bg-gray-50 transition-all">
                    <Share2 size={18} strokeWidth={1.5} />
                  </button>
                </div>
                
                <div className="flex items-end space-x-4 mb-8">
                  <p className="text-3xl font-black elegant-font">KSh {product.price.toLocaleString()}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pb-1">VAT Included</p>
                </div>

                <div className="p-6 bg-gray-50 border-l-2 border-accent mb-10">
                  <p className="text-sm italic text-gray-600 leading-relaxed font-serif">
                    "A masterclass in silhouette and texture. This piece embodies the soul of modern Nairobi luxury." 
                    <span className="block mt-2 text-[10px] font-bold uppercase tracking-widest text-primary">— Maison Note</span>
                  </p>
                </div>
              </div>

              {/* Selection Logic */}
              <div className="space-y-10">
                {/* Colors */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Palette Selection</h3>
                  <div className="flex flex-wrap gap-3">
                    {[...new Set(product.variants.map(v => v.color))].map(color => (
                      <button 
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${selectedColor === color ? 'bg-primary text-white scale-105 shadow-xl' : 'border border-gray-100 hover:border-primary'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Size Selection</h3>
                    <button onClick={() => setIsSizeGuideOpen(true)} className="text-[10px] font-bold uppercase tracking-widest text-accent border-b border-accent pb-1">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {[...new Set(product.variants.map(v => v.size))].map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-14 w-14 flex items-center justify-center text-xs font-bold transition-all ${selectedSize === size ? 'bg-primary text-white scale-110 shadow-lg' : 'border border-gray-100 hover:border-primary'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-4 pt-6">
                  <AnimatePresence>
                    {addedToCart && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-50 text-green-700 p-4 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2"
                      >
                        <Check size={14} />
                        <span>Added to your collection</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="flex space-x-4">
                    <button 
                      onClick={handleAddToCart}
                      className={`flex-grow h-20 text-[10px] font-bold uppercase tracking-[0.4em] transition-all flex items-center justify-center ${inStock ? 'bg-primary text-white hover:bg-accent' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      disabled={!inStock}
                    >
                      {inStock ? 'Add to Collection' : 'Archive (Out of Stock)'}
                    </button>
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className="h-20 w-20 border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all group"
                    >
                      <Heart 
                        size={24} 
                        className={`transition-colors ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-300 group-hover:text-red-500'}`} 
                        strokeWidth={isInWishlist(product.id) ? 0 : 1.5}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Refined Accordions */}
              <div className="pt-12 border-t border-gray-100 space-y-6">
                {[
                  { id: 'details', label: 'Artisanal Details', content: product.description },
                  { id: 'care', label: 'Composition & Care', content: '100% Premium Kenya Silk. Dry clean only. Handle with extreme care to preserve the hand-beaded elements.' },
                  { id: 'shipping', label: 'Delivery & Returns', content: 'Complimentary shipping within Nairobi. Worldwide express shipping available. 14-day return policy for unused pieces.' }
                ].map((item) => (
                  <div key={item.id} className="border-b border-gray-100 pb-6">
                    <button 
                      onClick={() => setActiveAccordion(activeAccordion === item.id ? '' : item.id)}
                      className="w-full flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em]"
                    >
                      <span>{item.label}</span>
                      <Plus size={14} className={`transition-transform duration-500 ${activeAccordion === item.id ? 'rotate-45' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeAccordion === item.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="pt-6 text-sm text-gray-500 leading-relaxed font-serif italic">{item.content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Brand Trust */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="flex items-center space-x-4 p-6 bg-gray-50">
                  <ShieldCheck size={20} className="text-accent" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Certified <br /> Authentic</span>
                </div>
                <div className="flex items-center space-x-4 p-6 bg-gray-50">
                  <Info size={20} className="text-accent" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Ethically <br /> Sourced</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lookbook Expansion (Related) */}
        <div className="mt-64">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-black elegant-font tracking-tighter uppercase">More from the Archive</h2>
            <Link to="/products" className="text-[10px] font-bold uppercase tracking-widest border-b border-primary pb-2">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {relatedProducts.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-6 relative">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
                </div>
                <h3 className="text-xl font-black elegant-font uppercase group-hover:text-accent transition-colors">{p.name}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">KSh {p.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Size Guide Modal (Redesigned - Editorial Layout) */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-white overflow-y-auto selection:bg-accent selection:text-white"
          >
            {/* Minimalist Sticky Header */}
            <div className="sticky top-0 z-[160] bg-white/90 backdrop-blur-xl px-6 md:px-12 py-6 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-[1px] bg-primary hidden md:block"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary">SHABIL Size Guide</span>
              </div>
              <button 
                onClick={() => setIsSizeGuideOpen(false)} 
                className="group flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest hover:text-accent transition-colors"
              >
                <span>Close</span>
                <div className="h-10 w-10 flex items-center justify-center border border-gray-100 rounded-full group-hover:border-accent transition-all">
                  <Plus size={18} className="rotate-45" />
                </div>
              </button>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              {/* Hero Section */}
              <div className="py-20 md:py-32 border-b border-gray-100">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2 className="text-[12vw] md:text-[8vw] font-black elegant-font leading-[0.8] uppercase tracking-tighter mb-12">
                    Finding Your <br />
                    <span className="text-accent italic font-light serif ml-[5vw] md:ml-[10vw]">Silhouette</span>
                  </h2>
                  <p className="max-w-2xl text-lg md:text-xl text-gray-500 font-serif italic leading-relaxed md:ml-[10vw]">
                    "A garment is only as beautiful as the fit it commands. Our sizing is designed to embrace the modern form with artisanal precision."
                  </p>
                </motion.div>
              </div>

              {/* Section 1: Anatomy of Fit */}
              <div className="py-24 md:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                  <div className="lg:col-span-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent sticky top-32">01 — The Anatomy</h3>
                  </div>
                  <div className="lg:col-span-8 space-y-24 md:space-y-32">
                    {[
                      { l: 'The Bust', d: 'With arms relaxed at your sides, measure around the fullest part of your chest, keeping the tape measure parallel to the floor.', icon: '01' },
                      { l: 'The Waist', d: 'Measure around your natural waistline—the narrowest part of the upper body, typically just above the navel.', icon: '02' },
                      { l: 'The Hips', d: 'Stand with feet together and measure around the fullest part of your hips, ensuring the tape is straight and snug but not tight.', icon: '03' }
                    ].map((item, idx) => (
                      <motion.div 
                        key={item.l}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="group"
                      >
                        <div className="flex items-baseline space-x-6 md:space-x-12">
                          <span className="text-4xl md:text-6xl font-black elegant-font text-gray-100 group-hover:text-accent/20 transition-colors duration-700">{item.icon}</span>
                          <div className="flex-1 border-b border-gray-100 pb-12">
                            <h4 className="text-2xl md:text-4xl font-black elegant-font uppercase mb-6">{item.l}</h4>
                            <p className="text-gray-500 text-lg leading-relaxed font-serif italic max-w-xl">{item.d}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 2: Measurement Chart */}
              <div className="py-24 md:py-32 border-t border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                  <div className="lg:col-span-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent sticky top-32">02 — Standard Metric</h3>
                    <p className="mt-8 text-sm text-gray-400 uppercase tracking-widest leading-loose">
                      Measurements are shown in <br /> 
                      Centimeters (CM) and Inches (IN). <br />
                      Tolerance: +/- 1.5cm
                    </p>
                  </div>
                  <div className="lg:col-span-8">
                    <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-primary">
                            <th className="py-10 text-[10px] font-bold uppercase tracking-widest text-gray-400">Size Selection</th>
                            <th className="py-10 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Bust (CM/IN)</th>
                            <th className="py-10 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Waist (CM/IN)</th>
                            <th className="py-10 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Hips (CM/IN)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {[
                            { s: 'Extra Small', c: 'XS', b: '82 / 32.2', w: '64 / 25.2', h: '90 / 35.4' },
                            { s: 'Small', c: 'S', b: '86 / 33.8', w: '68 / 26.7', h: '94 / 37.0' },
                            { s: 'Medium', c: 'M', b: '90 / 35.4', w: '72 / 28.3', h: '98 / 38.6' },
                            { s: 'Large', c: 'L', b: '94 / 37.0', w: '76 / 29.9', h: '102 / 40.1' },
                            { s: 'Extra Large', c: 'XL', b: '98 / 38.6', w: '80 / 31.5', h: '106 / 41.7' }
                          ].map((row) => (
                            <tr key={row.c} className="group hover:bg-gray-50/50 transition-all duration-500">
                              <td className="py-12">
                                <span className="block text-xl font-black elegant-font uppercase">{row.c}</span>
                                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">{row.s}</span>
                              </td>
                              <td className="py-12 text-center font-serif italic text-gray-600">{row.b}</td>
                              <td className="py-12 text-center font-serif italic text-gray-600">{row.w}</td>
                              <td className="py-12 text-right font-serif italic text-gray-600">{row.h}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Bespoke */}
              <div className="py-24 md:py-48 text-center bg-primary text-white -mx-6 md:-mx-12 px-6 md:px-12 relative overflow-hidden group">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative z-10"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[1em] mb-12 block text-accent">Personalized Precision</span>
                  <h3 className="text-4xl md:text-7xl font-black elegant-font uppercase tracking-tighter mb-12 leading-[0.9]">
                    The Bespoke <br /> Experience
                  </h3>
                  <p className="max-w-xl mx-auto text-lg md:text-xl font-serif italic text-gray-300 leading-relaxed mb-16">
                    "If our standard sizing does not meet your requirements, our Master Tailors are available for private appointments to create a piece unique to your measurements."
                  </p>
                  <button className="px-12 py-6 bg-white text-primary text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-accent hover:text-white transition-all duration-500 shadow-2xl">
                    Request a Fitting
                  </button>
                </motion.div>
                
                {/* Abstract background element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-white/5 rounded-full group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
              </div>

              {/* Final Footer */}
              <div className="py-12 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-300 italic">SHABIL Nairobi • 2024</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductDetails
