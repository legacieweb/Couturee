import React, { useState, useEffect, useMemo } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { products as localProducts } from '../data/products'
import { api } from '../utils/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, ChevronRight, Loader2 } from 'lucide-react'
import { categories } from '../components/CollectionsNavBar'

const getPriceRange = (variants) => {
  const allPrices = variants.flatMap(v => v.prices || [])
  if (allPrices.length === 0) return 'Price on request'
  const min = Math.min(...allPrices)
  const max = Math.max(...allPrices)
  return min === max ? `$${min.toLocaleString()}` : `$${min.toLocaleString()} - $${max.toLocaleString()}`
}

const Products = ({ forcedCategory }) => {
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [gender, setGender] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const genders = ['All', 'Male', 'Female']

  const filteredCategories = useMemo(() => {
    if (!gender || gender === 'All') return categories
    const matchingSlugs = new Set(
      products
        .filter(p => p.gender && p.gender.toLowerCase() === gender.toLowerCase())
        .map(p => p.category.toLowerCase())
    )
    return categories.filter(c => c.slug === 'all' || matchingSlugs.has(c.slug))
  }, [gender, products])

  useEffect(() => {
    setProducts(localProducts)
    setLoading(false)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const genderParam = params.get('gender')
    const searchParam = params.get('search')
    const categoryParam = params.get('category')
    setGender(genderParam ? genderParam.charAt(0).toUpperCase() + genderParam.slice(1).toLowerCase() : 'All')
    if (searchParam) setSearchQuery(searchParam)
    else setSearchQuery('')
    if (categoryParam) setCategoryFilter(categoryParam)
    else setCategoryFilter(null)
  }, [location])

  useEffect(() => {
    let result = products
    const activeFilter = forcedCategory || categoryFilter
    if (activeFilter && activeFilter !== 'all') {
      result = result.filter(p => {
        const productCategory = p.category.toLowerCase()
        const filterCategory = activeFilter.toLowerCase()
        return productCategory === filterCategory
      })
    }
    if (gender !== 'All') result = result.filter(p => p.gender && p.gender.toLowerCase() === gender.toLowerCase())
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    setFilteredProducts(result)
  }, [gender, searchQuery, products, forcedCategory, categoryFilter])

  return (
    <div className="min-h-screen bg-white pt-40">
      {/* Editorial Header */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 mb-16">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mb-6 block"
            >
              Collection Archives
            </motion.span>
<motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              key={gender}
              className="text-6xl md:text-8xl lg:text-[10vw] font-black elegant-font tracking-tighter leading-[0.8] uppercase"
            >
              {gender === 'All' ? 'Signature' : gender} <br/>
              <span className="italic font-normal serif lowercase ml-[10vw]">{gender === 'All' ? 'Pieces' : 'Collection'}</span>
            </motion.h1>
          </div>
          <div className="flex items-center space-x-12">
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Curation</p>
              <p className="text-3xl font-black elegant-font">{filteredProducts.length} PIECES</p>
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="h-24 w-24 bg-primary text-white flex flex-col items-center justify-center space-y-2 hover:bg-accent transition-all group"
            >
              <Plus size={20} className={`transition-transform duration-500 ${isFilterOpen ? 'rotate-45' : ''}`} />
              <span className="text-[8px] font-bold uppercase tracking-widest">Filter</span>
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
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Gender</h3>
                <div className="flex flex-col space-y-4">
                  {genders.map(g => (
                    <button 
                      key={g}
                      onClick={() => setGender(g)}
                      className={`text-2xl font-black elegant-font text-left hover:text-accent transition-colors ${gender === g ? 'text-primary' : 'text-gray-300'}`}
                    >
                      {g}
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

      {/* Collections Navigation - Interactive Category Buttons */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-10">
          <div className="lg:hidden">
            <div className="flex overflow-x-auto space-x-4 pb-3 scrollbar-hide">
              {filteredCategories.map((category) => {
                const isActive = categoryFilter === category.slug || (categoryFilter === null && category.slug === 'all')
                return (
                  <motion.div
                    key={category.slug}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={`/products?category=${category.slug}${gender !== 'All' ? `&gender=${gender.toLowerCase()}` : ''}`}
                      className={`flex-shrink-0 px-8 py-4 border-2 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-center font-bold uppercase tracking-widest text-[11px] ${
                        isActive
                          ? 'bg-accent text-white border-accent'
                          : 'bg-white text-primary border-gray-200 hover:border-accent hover:bg-accent hover:text-white'
                      }`}
                    >
                      {category.name}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="flex items-center space-x-6">
              {filteredCategories.map((category) => {
                const isActive = categoryFilter === category.slug || (categoryFilter === null && category.slug === 'all')
                return (
                  <motion.div
                    key={category.slug}
                    whileHover={{ scale: 1.08, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <Link
                      to={`/products?category=${category.slug}${gender !== 'All' ? `&gender=${gender.toLowerCase()}` : ''}`}
                      className={`px-10 py-5 border-2 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 font-bold uppercase tracking-widest text-sm flex items-center justify-center ${
                        isActive
                          ? 'bg-accent text-white border-accent'
                          : 'bg-white text-primary border-gray-200 hover:border-accent hover:bg-accent hover:text-white'
                      }`}
                    >
                      {category.name}
                    </Link>
                    {isActive && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent"
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-24">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
            <Loader2 size={40} className="animate-spin text-accent" />
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400">Loading Archives...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-12 gap-y-12 md:gap-y-24">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <Link to={`/product/${product.id}`}>
<div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-50 group-hover:shadow-2xl transition-all duration-700">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    />
                    {/* Category Label */}
                    <div className="absolute top-0 left-0 p-4 md:p-6 overflow-hidden">
                      <motion.p 
                        className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-primary/40 group-hover:text-accent transition-colors duration-500"
                      >
                        {product.category}
                      </motion.p>
                    </div>
                    {/* Gender Label */}
                    <div className="absolute top-0 right-0 p-4 md:p-6 overflow-hidden">
                      <motion.p 
                        className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-primary/40 group-hover:text-accent transition-colors duration-500"
                      >
                        {product.gender}
                      </motion.p>
                    </div>
                    
                    {/* Subtle Overlay on Hover */}
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <h3 className="text-xs md:text-xl font-black elegant-font tracking-tight uppercase leading-tight group-hover:text-accent transition-colors duration-500">
                        {product.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center space-x-4">
<span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-widest">
                        {getPriceRange(product.variants)}
                      </span>
                      <div className="flex-grow h-[1px] bg-gray-100 group-hover:bg-accent/30 transition-colors duration-700" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <h2 className="text-4xl font-black elegant-font text-gray-200 uppercase mb-8">No pieces found</h2>
            <button onClick={() => {setGender('All'); setSearchQuery('')}} className="text-[10px] font-bold uppercase tracking-[0.3em] border-b-2 border-accent pb-2">Reset Collection</button>
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