import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { products } from '../data/products'
import { ArrowUpRight, Play, Globe, Award, Sparkles } from 'lucide-react'
import coutreeVideo from '../coutree video.mp4'

const Home = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500])

  return (
    <div ref={containerRef} className="bg-white">
      {/* Hero Section - Editorial Style */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            style={{ y: y1 }}
            src="https://static.fibre2fashion.com//articleresources/images/23/2287/988ebe_Big.jpg" 
            className="w-full h-[120%] object-cover grayscale opacity-90"
            alt="COUTREE 254 Luxury High Fashion - Kenyan Haute Couture"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <h1 className="text-[15vw] md:text-[12vw] font-black elegant-font leading-[0.8] tracking-tighter mix-blend-difference mb-8">
              ELEGANT <br />
              <span className="italic font-normal serif">Women</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col items-center space-y-8"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.8em] text-accent">Setting the Standard for Kenyan Style.</p>
            <Link to="/products" className="group relative px-12 py-5 overflow-hidden border border-white/30 backdrop-blur-sm">
              <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest group-hover:text-primary transition-colors duration-500">Explore Collection</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
          </motion.div>
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
                Every stitch at COUTREE 254 is a deliberate act of artistry. We source the finest silks from the coast and hand-bead every gown in our Westlands atelier.
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
              <img src="https://cdn.shopify.com/s/files/1/0293/9277/files/06-13-24_S3_50_10690D_Pink_TK_JS_12-35-47_23184_MH_PXF.jpg?v=1718662984&width=600&height=900&crop=center" alt="Handcrafted pink gala gown detail - COUTREE 254" className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" />
            </motion.div>
            <motion.div style={{ y: typeof window !== 'undefined' && window.innerWidth > 1024 ? y2 : 0 }}>
              <img src="https://cdn.shopify.com/s/files/1/0293/9277/files/02-14-24_S3_30_KSWD3111701G_Pink_HY_RL_13-57-55_31613_PXF.jpg?v=1736893632&width=600&height=900&crop=center" alt="Luxury evening dress from COUTREE 254 Nairobi" className="w-full aspect-[3/4] object-cover shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Highlight - Editorial Cards */}
      <section className="py-32 bg-[#f9f9f9]">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-20">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.5em] text-accent mb-4">Current Edit</h3>
              <h2 className="text-5xl font-black elegant-font tracking-tighter">The Gala Series</h2>
            </div>
            <Link to="/products" className="text-[10px] font-bold uppercase tracking-widest border-b border-primary pb-2 hover:text-accent hover:border-accent transition-all">View Full Series</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {products.slice(0, 3).map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative overflow-hidden aspect-[3/4] mb-8 bg-gray-200">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="w-20 h-20 border border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <ArrowUpRight size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">{product.category}</p>
                    <h4 className="text-2xl font-black elegant-font mb-2 group-hover:text-accent transition-colors">{product.name}</h4>
                    <p className="text-sm font-bold text-primary">KSh {product.price.toLocaleString()}</p>
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
          src={coutreeVideo} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-black elegant-font tracking-tighter">The Coutree Experience</h2>
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
