import React from 'react'
import { motion } from 'framer-motion'

const PrivacyPolicy = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mb-4">Maison Information</p>
          <h1 className="text-5xl md:text-7xl font-black elegant-font tracking-tighter uppercase">Privacy Policy</h1>
        </motion.div>

        <div className="space-y-12 text-gray-600 leading-relaxed prose prose-lg max-w-none">
          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">Introduction</h2>
            <p>At COUTUREC we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit our website or make a purchase.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">Information We Collect</h2>
            <p>We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, make a purchase, or contact our customer service team. This may include your name, email address, shipping address, and payment information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">How We Use Your Information</h2>
            <p>We use the information we collect to process your orders, communicate with you about our products and services, and improve your overall shopping experience. We do not sell or rent your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">Data Security</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information. Your personal data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">Contact Us</h2>
            <p>If you have any questions about our Privacy Policy, please contact us at concierge@COUTREE254.com.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
