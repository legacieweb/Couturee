import React from 'react'
import { motion } from 'framer-motion'

const AboutUs = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mb-4">Our Story</p>
          <h1 className="text-5xl md:text-7xl font-black elegant-font tracking-tighter uppercase">About MAISON KENYA</h1>
        </motion.div>

        <div className="space-y-12 text-gray-600 leading-relaxed text-lg">
          <p>
            Founded in the heart of Nairobi, our contemporary luxury fashion house blends traditional elegance with modern sophistication. Our name reflects our roots, the pride of Kenya—and our commitment to "Couture" craftsmanship.
          </p>
          <p>
            We believe that every garment tells a story. Our collections are meticulously designed and handcrafted by local artisans, ensuring that each piece meets the highest standards of quality and exclusivity. From gala events to intimate evening gatherings, we provide the modern woman with timeless pieces that exude confidence and grace.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-sm">
              <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Craftsmanship" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-black elegant-font mb-6 uppercase tracking-tight text-primary">Our Craftsmanship</h3>
              <p className="text-base">
                Each creation is a testament to the skill of our tailors. We source the finest silks, velvets, and hand-woven fabrics to create textures that feel as luxurious as they look.
              </p>
            </div>
          </div>
          <p>
            Our mission is to redefine Kenyan luxury fashion on the global stage, celebrating our heritage while embracing the future of design.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
