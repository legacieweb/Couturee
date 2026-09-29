import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { products as localProducts } from '../data/products'
import { api } from '../utils/api'
import { ArrowUpRight, Play, Globe, Award, Sparkles, Loader2 } from 'lucide-react'

const getPriceRange = (variants) => {
  const allPrices = variants.flatMap(v => v.prices || [])
  if (allPrices.length === 0) return 'Price on request'
  const min = Math.min(...allPrices)
  const max = Math.max(...allPrices)
  return min === max ? `$${min.toLocaleString()}` : `$${min.toLocaleString()} - $${max.toLocaleString()}`
}

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    setProducts(localProducts)
    setLoading(false)
  }, [])
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500])

  return (
    <div ref={containerRef} className="bg-white">
      <section className="relative min-h-[min(820px,100svh)] overflow-hidden bg-[#f5f4ef] pt-20 md:pt-28">
        <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-[1800px] grid-cols-1 md:grid-cols-[0.88fr_1.12fr]">
          <div className="relative z-10 flex flex-col justify-center px-6 py-6 sm:px-10 sm:py-12 md:px-12 md:py-20 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#776b4d] md:mb-7">
                <span className="h-px w-8 bg-accent" />
                Nairobi design, made to move
              </p>
              <h1 className="max-w-[11ch] text-4xl font-black uppercase leading-[0.98] text-[#171816] sm:text-6xl lg:text-7xl xl:text-8xl">
                Dress like <span className="font-normal italic normal-case text-[#a88745]">you mean it.</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-[#555650] sm:mt-7 sm:text-base sm:leading-7">
                Considered pieces for wherever your story takes you. Discover the latest from Shabil.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 sm:mt-9 sm:gap-y-4">
                <Link to="/products" className="group inline-flex min-h-14 items-center gap-7 bg-[#171816] px-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#a88745]">
                  Explore the collection
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </div>
            </motion.div>
            <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.24em] text-[#8b8b83] sm:mt-14">01 / Designed in Nairobi · Worn everywhere</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-[24svh] overflow-hidden sm:min-h-[38svh] md:min-h-0"
          >
            <img
              src={localProducts.find((product) => product.id === 9)?.images?.[0]}
              className="absolute inset-0 h-full w-full object-cover object-center"
              alt="Shabil summer dress from the latest collection"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white sm:bottom-9 sm:left-9 sm:right-9">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/75">The latest edit</p>
                <p className="mt-2 text-lg font-semibold">A little more you.</p>
              </div>
              <Link to="/product/9" aria-label="Discover the featured dress" className="grid h-12 w-12 place-items-center border border-white/70 transition-colors hover:bg-white hover:text-[#171816]">
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products - Price Range Display */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h3 className="text-accent text-[10px] font-bold uppercase tracking-[0.5em] mb-4">Featured</h3>
            <h2 className="text-4xl md:text-6xl font-black elegant-font tracking-tighter uppercase">Curated Pieces</h2>
          </div>
          <p className="text-gray-400 max-w-sm text-sm uppercase tracking-widest">Handpicked selections with transparent pricing</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-[3/4] bg-gray-50 overflow-hidden mb-4">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="text-sm font-black elegant-font uppercase group-hover:text-accent transition-colors leading-tight">{product.name}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-2">{getPriceRange(product.variants)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Signature Collections - Showcase the 5 Main Categories */}
      <section className="py-32 bg-[#f9f9f9]">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.5em] text-accent mb-4">The Collection</h3>
              <h2 className="text-5xl md:text-7xl font-black elegant-font tracking-tighter uppercase">Signature <br className="hidden md:block"/> Pieces</h2>
            </div>
<p className="text-gray-400 max-w-sm text-sm uppercase tracking-widest leading-relaxed">
               Discover our collections filtered by gender. Shop Male or Female pieces.
</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {[
              { name: 'All', img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=60', path: '/products', label: '01' },
              { name: 'Male', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=60', path: '/products?gender=male', label: '02' },
              { name: 'Female', img: 'https://images.unsplash.com/photo-1550639524-a6f58345a2ca?w=600&auto=format&fit=crop&q=60', path: '/products?gender=female', label: '03' },
            ].map((cat, idx) => (
              <motion.div 
                key={cat.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                 className="group relative h-[400px] md:h-[700px] overflow-hidden"
               >
                 <Link to={cat.path} className="block w-full h-full cursor-pointer">
                   <img src={cat.img} alt={cat.name} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-[1.5s] ease-out" />
                   
                   {/* Subtle Gradient */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
                   
                   {/* Overlay Content */}
                   <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-between items-center text-center">
                     <span className="text-white/40 text-[8px] md:text-[10px] font-black elegant-font group-hover:text-accent transition-colors duration-500">{cat.label}</span>
                     
                     <div className="space-y-2 md:space-y-4">
                       <h4 className="text-xl md:text-3xl font-black elegant-font text-white uppercase tracking-tighter group-hover:scale-110 transition-transform duration-700">{cat.name}</h4>
                       <div className="w-0 h-[1px] bg-accent mx-auto group-hover:w-12 transition-all duration-700" />
                       <p className="text-[6px] md:text-[8px] font-bold text-accent uppercase tracking-[0.5em] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">Enter Archives</p>
                      <p className="text-[7px] md:text-[9px] font-bold text-white/80 uppercase tracking-widest translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                        {cat.name === 'All' 
                          ? getPriceRange(products.flatMap(p => p.variants))
                          : products.filter(p => p.gender && p.gender.toLowerCase() === cat.name.toLowerCase()).length > 0
                            ? getPriceRange(products.filter(p => p.gender && p.gender.toLowerCase() === cat.name.toLowerCase()).flatMap(p => p.variants))
                            : 'Explore Collection'}
                      </p>
                     </div>
                   </div>
                 </Link>
               </motion.div>
             ))}
           </div>

          <div className="mt-20 flex justify-center">
            <Link to="/products" className="group relative px-16 py-6 overflow-hidden border border-primary/10 backdrop-blur-sm bg-primary text-white">
              <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.4em] group-hover:text-accent transition-colors duration-500">Shop All Collections</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* Horizontal Marquee Section */}
      <div className="py-20 border-y border-gray-100 overflow-hidden relative">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex whitespace-nowrap space-x-20 text-[8vw] font-light elegant-font opacity-20 uppercase select-none"
        >
          <span>Handmade in Nairobi</span>
          <span>Premium Kenyan Silk</span>
          <span>Bespoke Tailoring</span>
          <span>Est. 2024</span>
        </motion.div>
      </div>

      {/* Video / Atmosphere Section */}
      <section className="relative h-[80vh] overflow-hidden flex items-center justify-center group">
        <img
          src={localProducts[1]?.images?.[0]}
          alt="Shabil collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-black elegant-font tracking-tighter">The Shabil Experience</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] mt-6">Watch the Runway Reveal</p>
        </div>
      </section>

      {/* Why Us / Values */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gray-50 flex items-center justify-center mx-auto rounded-full">
              <Globe size={24} className="text-accent" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Global Shipping</h3>
            <p className="text-xs text-gray-500 leading-relaxed">From Nairobi to London, NYC, and beyond. We bring Kenyan elegance to your doorstep.</p>
          </div>
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gray-50 flex items-center justify-center mx-auto rounded-full">
              <Award size={24} className="text-accent" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Master Tailoring</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Each piece is custom-fitted to your measurements for the perfect silhouette.</p>
          </div>
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gray-50 flex items-center justify-center mx-auto rounded-full">
              <Sparkles size={24} className="text-accent" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Ethical Luxury</h3>
            <p className="text-xs text-gray-500 leading-relaxed">100% sustainable practices and fair wages for our team of Kenyan artisans.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home