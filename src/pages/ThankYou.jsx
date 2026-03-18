import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Instagram, Mail } from 'lucide-react'

const ThankYou = () => {
  const orderNumber = `ORD-${Math.floor(Math.random() * 90000) + 10000}`

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 pt-40 pb-20 overflow-hidden relative">
      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-gray-50/50 whitespace-nowrap pointer-events-none elegant-font select-none">
        SUCCESS
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="space-y-12"
        >
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 bg-primary text-white flex items-center justify-center rounded-full shadow-2xl">
              <CheckCircle size={40} strokeWidth={1.5} />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mb-6">Maison Confirmation</p>
            <h1 className="text-6xl md:text-8xl font-black elegant-font tracking-tighter leading-none uppercase mb-8">
              Gratitude. <br />
              <span className="italic font-normal serif">Bienvenue.</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto italic font-serif">
              "Your choice reflects a taste for excellence. Your piece is now being carefully prepared in our Nairobi atelier."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-16 border-y border-gray-100">
            <div className="text-center md:text-right md:border-r border-gray-100 md:pr-12">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Order Archive Reference</p>
              <h4 className="text-2xl font-black elegant-font uppercase tracking-tighter">{orderNumber}</h4>
            </div>
            <div className="text-center md:text-left md:pl-12">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Estimated Delivery</p>
              <h4 className="text-2xl font-black elegant-font uppercase tracking-tighter">2 - 3 Business Days</h4>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12">
            <Link to="/products" className="group relative px-12 py-6 overflow-hidden border border-primary w-full md:w-auto">
              <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.3em] group-hover:text-white transition-colors duration-500">Back to Archives</span>
              <div className="absolute inset-0 bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </Link>
            <Link to="/dashboard" className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center group">
              <span>View Order Progress</span>
              <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="pt-20 flex justify-center space-x-12 text-gray-400">
            <div className="flex items-center space-x-2 cursor-pointer hover:text-accent transition-colors">
              <Instagram size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">@couturee254</span>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:text-accent transition-colors">
              <Mail size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">maison@coutree254.com</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ThankYou
