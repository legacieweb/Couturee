import React from 'react'
import { motion } from 'framer-motion'

const TermsOfService = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mb-4">Maison Information</p>
          <h1 className="text-5xl md:text-7xl font-black elegant-font tracking-tighter uppercase">Terms of Service</h1>
        </motion.div>

        <div className="space-y-12 text-gray-600 leading-relaxed prose prose-lg max-w-none">
          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">Agreement to Terms</h2>
            <p>By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">Use of Content</h2>
            <p>All content on this website, including but not limited to text, images, logos, and designs, is the property of SHABIL and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or use any content without our prior written consent.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">Products and Pricing</h2>
            <p>We strive to provide accurate product descriptions and pricing information. However, we reserve the right to correct any errors and to change product information and prices at any time without prior notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">User Conduct</h2>
            <p>You agree to use our website for lawful purposes only and to not engage in any activity that could damage, disable, or impair the performance of our site or interfere with any other user's enjoyment of it.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black elegant-font uppercase tracking-tight text-primary mb-6">Changes to Terms</h2>
            <p>We reserve the right to update or modify these Terms of Service at any time without prior notice. Your continued use of our website following any changes constitutes your acceptance of the new terms.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
