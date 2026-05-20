import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { products as localProducts } from '../data/products'
import { api } from '../utils/api'
import { ArrowUpRight, Play, Globe, Award, Sparkles, Loader2 } from 'lucide-react'
import shabilVideo from '../coutree video.mp4'

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
      {/* Hero Section - Redesigned Cinematic Editorial */}
      <section className="relative h-[110vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        {/* Background Layer with Parallax */}
        <motion.div 
          style={{ y: y1, scale: 1.1 }}
          className="absolute inset-0 z-0 opacity-60"
        >
          <img 
            src="https://static.fibre2fashion.com//articleresources/images/23/2287/988ebe_Big.jpg" 
            className="w-full h-full object-cover grayscale"
            alt="Shabil Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
        </motion.div>

        {/* Floating Narrative Text (Left) */}
        <div className="absolute left-12 top-1/2 -translate-y-1/2 z-20 hidden xl:block">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="space-y-2"
          >
            <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-accent/60 vertical-text py-12 border-l border-accent/20">ESTABLISHED 2024</p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-[1800px] px-6 md:px-12 flex flex-col items-center">
          <div className="relative w-full text-center">
            {/* Massive Background Text */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none select-none overflow-hidden"
            >
              <h2 className="text-[25vw] font-black elegant-font opacity-[0.03] leading-none whitespace-nowrap text-white">
                Shabil
              </h2>
            </motion.div>

            {/* Foreground Typography */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="relative"
            >
              <motion.h1 
                className="text-[14vw] md:text-[10vw] font-black elegant-font leading-[0.75] tracking-tighter text-white uppercase"
              >
                <span className="block overflow-hidden">
                  <motion.span 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="block"
                  >
                    High
                  </motion.span>
                </span>
                <span className="block overflow-hidden mt-2">
                  <motion.span 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                    className="block italic font-normal serif lowercase"
                  >
                    Fashion
                  </motion.span>
                </span>
              </motion.h1>

              {/* Central Badge/Detail */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="mt-12 flex flex-col items-center space-y-12"
              >
                <div className="w-[1px] h-24 bg-gradient-to-b from-accent/0 via-accent to-accent/0" />
                
                <div className="flex flex-col items-center space-y-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.8em] text-accent text-center max-w-xs">
                    THE PINNACLE OF KENYAN ARTISANSHIP
                  </p>
                  
                  <Link to="/products" className="group relative px-20 py-8 overflow-hidden border border-white/10 hover:border-accent/40 transition-colors duration-700">
                    {/* Architectural Borders */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                    
                    {/* Background Sweep */}
                    <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-[0.16,1,0.3,1]" />
                    
                    <div className="relative h-6 overflow-hidden">
                      <motion.div 
                        className="flex flex-col items-center"
                        whileHover={{ y: -24 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white flex items-center">
                          Explore Collection
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-accent mt-4 flex items-center">
                          Discover Products <ArrowUpRight size={12} className="ml-2" />
                        </span>
                      </motion.div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* Featured Grid - Creative Layout */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center mb-20 md:mb-32">
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start"
            >
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em]">The Craft</span>
              <h2 className="text-5xl md:text-7xl font-black elegant-font tracking-tighter leading-none">
                Beyond <br className="hidden md:block" /> 
                <span className="italic font-normal">Fast Fashion.</span>
              </h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                Every stitch is a deliberate act of artistry. We source the finest silks from the coast and hand-bead every gown in our Westlands atelier.
              </p>
              <div className="flex items-center justify-center lg:justify-start space-x-12 pt-4 md:pt-8 w-full">
                <div className="text-center">
                  <h4 className="text-2xl md:text-3xl font-black mb-1">100+</h4>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Hours per Gown</p>
                </div>
                <div className="text-center">
                  <h4 className="text-2xl md:text-3xl font-black mb-1">KENYA</h4>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Design Origin</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-2 gap-4 md:gap-6 relative mt-12 lg:mt-0">
            <motion.div style={{ y: typeof window !== 'undefined' && window.innerWidth > 1024 ? y1 : 0 }} className="pt-12 md:pt-24">
              <img src="https://cdn.shopify.com/s/files/1/0293/9277/files/06-13-24_S3_50_10690D_Pink_TK_JS_12-35-47_23184_MH_PXF.jpg?v=1718662984&width=600&height=900&crop=center" alt="Handcrafted pink gala gown detail" className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" />
            </motion.div>
            <motion.div style={{ y: typeof window !== 'undefined' && window.innerWidth > 1024 ? y2 : 0 }}>
              <img src="https://cdn.shopify.com/s/files/1/0293/9277/files/02-14-24_S3_30_KSWD3111701G_Pink_HY_RL_13-57-55_31613_PXF.jpg?v=1736893632&width=600&height=900&crop=center" alt="Luxury evening dress from Nairobi" className="w-full aspect-[3/4] object-cover shadow-2xl" />
            </motion.div>
          </div>
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
              Discover our core categories. From street-ready croptops to luxury leather statements.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: 'Croptops', img: 'https://i.imgur.com/IIp1oeb.png', path: '/products?category=Croptops', label: '01' },
              { name: 'Leather Jackets', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=60', path: '/products?category=Leather Jackets', label: '02' },
              { name: 'Leather Dress', img: 'https://images.unsplash.com/photo-1550639524-a6f58345a2ca?w=600&auto=format&fit=crop&q=60', path: '/products?category=Leather Dress', label: '03' },
              { name: 'Trousers', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=60', path: '/products?category=Trousers', label: '04' },
              { name: 'Sweatpants', img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=60', path: '/products?category=Sweatpants', label: '05' },
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
        <video 
          src={shabilVideo} 
          autoPlay 
          loop 
          muted 
          playsInline 
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
