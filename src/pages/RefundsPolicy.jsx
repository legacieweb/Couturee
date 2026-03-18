import React from 'react'
import { motion } from 'framer-motion'

const RefundsPolicy = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mb-4">Concierge Services</p>
          <h1 className="text-5xl md:text-7xl font-black elegant-font tracking-tighter uppercase">Returns & Refunds</h1>
        </motion.div>

        <div className="space-y-12 text-gray-600 leading-relaxed prose prose-lg max-w-none">
          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">Returns Eligibility</h2>
            <p>At COUTUREC, we take pride in the quality and craftsmanship of our products. If you are not completely satisfied with your purchase, you may return any item within 14 days of delivery, provided it is in its original condition, unworn, and with all tags attached.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">Non-Returnable Items</h2>
            <p>Please note that custom-made or bespoke orders, as well as final sale items, are non-returnable and non-refundable.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">Refund Process</h2>
            <p>Once we receive and inspect your returned item, we will process your refund within 7-10 business days. Refunds will be issued to the original payment method used at checkout.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">Exchanges</h2>
            <p>If you wish to exchange an item for a different size or color, please contact our concierge team at concierge@COUTUREC.com to initiate the process.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">Damaged Items</h2>
            <p>In the rare event that you receive a damaged or defective item, please contact us immediately, and we will arrange for a replacement or a full refund.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default RefundsPolicy
