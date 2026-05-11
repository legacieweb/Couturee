import React from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Instagram } from 'lucide-react'

const Contact = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mb-4">Get In Touch</p>
          <h1 className="text-5xl md:text-7xl font-black elegant-font tracking-tighter uppercase">Contact Us</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent mb-8">Direct Inquiries</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-6 text-lg text-gray-600">
                  <Mail size={20} className="text-primary" />
                  <span>concierge@shabil.com</span>
                </div>
                <div className="flex items-center space-x-6 text-lg text-gray-600">
                  <Phone size={20} className="text-primary" />
                  <span>+254 700 000 000</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent mb-8">Our Maison</h2>
              <div className="flex items-start space-x-6 text-lg text-gray-600">
                <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                <span>Nairobi Design District, <br />Westlands, Nairobi, Kenya</span>
              </div>
            </div>

            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent mb-8">Follow Us</h2>
              <div className="flex space-x-8">
                <a href="https://www.instagram.com/shabil/" target="_blank" rel="noopener noreferrer">
                  <Instagram size={24} className="text-gray-400 hover:text-primary transition-colors" />
                </a>
                <a href="https://www.tiktok.com/@shabil" target="_blank" rel="noopener noreferrer">
                  <svg 
                    viewBox="0 0 24 24" 
                    width="24" 
                    height="24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-sm shadow-sm">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">First Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-accent transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Last Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-accent transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                <input type="email" className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-accent transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Inquiry Type</label>
                <select className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-accent transition-colors appearance-none">
                  <option>General Inquiry</option>
                  <option>Press & Media</option>
                  <option>Wholesale</option>
                  <option>Bespoke Services</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Message</label>
                <textarea rows="4" className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-accent transition-colors resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent transition-colors">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
