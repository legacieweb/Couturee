import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { products } from '../data/products'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Search, ChevronRight } from 'lucide-react'

const Products = ({ forcedCategory }) => {
  const location = useLocation()
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [category, setCategory] = useState(forcedCategory || 'All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const categories = ['All', 'Gala', 'Evening', 'Casual', 'Formal']

  useEffect(() => {
    if (forcedCategory) {
      setCategory(forcedCategory)
      return
    }
    const params = new URLSearchParams(location.search)
    const catParam = params.get('category')
    const searchParam = params.get('search')
    if (catParam) setCategory(catParam)
    if (searchParam) setSearchQuery(searchParam)
  }, [location, forcedCategory])

  useEffect(() => {
    let result = products
    if (category !== 'All') result = result.filter(p => p.category === category)
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    setFilteredProducts(result)
  }, [category, searchQuery])

  return (
    <div className="pt-40 min-h-screen bg-white">
      {/* Editorial Header */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 mb-16 md:mb-24">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 md:gap-12">
          <div className="max-w-2xl">
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.5em] text-accent mb-4 md:text-accent mb-6 block">Collection Lookbook</span>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black elegant-font tracking-tighter leading-none uppercase">
              {category === 'All' ? 'Archives' : category}
            </h1>
          </div>
          <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto lg:space-x-12 border-t border-gray-100 lg:border-none pt-8 lg:pt-0">
            <div className="text-left lg:text-right">
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Pieces</p>
              <p className="text-xl md:text-2xl font-black elegant-font">{filteredProducts.length}</p>
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="group flex items-center space-x-4 bg-primary text-white px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all"
            >
              <span>{isFilterOpen ? 'Close' : 'Filter & Sort'}</span>
              <Plus size={16} className={`transition-transform duration-500 ${isFilterOpen ? 'rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Overlay */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-gray-100 bg-gray-50/50"
          >
            <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-20">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Category</h3>
                <div className="flex flex-col space-y-4">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-2xl font-black elegant-font text-left hover:text-accent transition-colors ${category === cat ? 'text-primary' : 'text-gray-300'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Sort By</h3>
                <div className="flex flex-col space-y-4 text-2xl font-black elegant-font text-gray-300">
                  <button className="text-left hover:text-accent transition-colors text-primary">Newest First</button>
                  <button className="text-left hover:text-accent transition-colors">Price: High - Low</button>
                  <button className="text-left hover:text-accent transition-colors">Price: Low - High</button>
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Refine</h3>
                <div className="relative">
                  <Search size={20} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input 
                    type="text" 
                    placeholder="Keywords..." 
                    className="w-full bg-transparent border-b border-gray-200 py-4 pl-10 text-xl font-black elegant-font focus:outline-none focus:border-accent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid - Lookbook Style */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-24">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden mb-8 bg-gray-100">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest text-white mix-blend-difference">
                      KSh {product.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-accent mb-2">{product.category}</p>
                      <h3 className="text-3xl font-black elegant-font tracking-tighter leading-none group-hover:text-accent transition-colors">{product.name}</h3>
                    </div>
                    <div className="h-12 w-12 border border-gray-100 flex items-center justify-center rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                      <ChevronRight size={20} strokeWidth={1.5} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <h2 className="text-4xl font-black elegant-font text-gray-200 uppercase mb-8">No pieces found</h2>
            <button onClick={() => {setCategory('All'); setSearchQuery('')}} className="text-[10px] font-bold uppercase tracking-[0.3em] border-b-2 border-accent pb-2">Reset Collection</button>
          </div>
        )}
      </div>

      {/* Editorial Footer Quote */}
      <div className="py-40 bg-primary text-white text-center px-6">
        <p className="text-[10px] font-bold uppercase tracking-[1em] text-accent mb-12">The Philosophy</p>
        <h2 className="text-4xl md:text-6xl font-black elegant-font tracking-tighter max-w-4xl mx-auto leading-tight italic">
          "Fashion fades, only style remains the same."
        </h2>
      </div>
    </div>
  )
}

export default Products
