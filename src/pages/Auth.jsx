import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, ShieldCheck, ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const { login, signup } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdminPrefill = () => {
    setEmail(import.meta.env.VITE_ADMIN_EMAIL || '')
    setPassword(import.meta.env.VITE_ADMIN_PASSWORD || '')
    setIsLogin(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      if (isLogin) {
        const data = await login({ email, password })
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/dashboard')
        }
      } else {
        await signup({ name, email, password })
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col lg:flex-row overflow-hidden">
      
      {/* Visual Section - Left Side */}
      <div className="hidden lg:block relative w-1/2 h-full bg-primary overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Maison Editorial" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-transparent" />
        </motion.div>

        {/* Brand Overlay */}
        <div className="absolute top-12 left-12 z-10">
          <Link to="/" className="text-3xl font-black elegant-font text-white tracking-tighter flex flex-col leading-none">
            <span>shabil</span>
            <span className="text-[8px] tracking-[0.8em] text-accent ml-1 -mt-1 font-bold">254</span>
          </Link>
        </div>

        <div className="absolute bottom-20 left-20 z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="text-accent text-[10px] font-bold uppercase tracking-[0.5em] mb-6">Since 2024</p>
            <h2 className="text-7xl font-black elegant-font text-white mb-8 uppercase tracking-tighter leading-[0.9]">
              The <br /> Essence of <br /> Luxury.
            </h2>
            <div className="w-20 h-px bg-accent mb-8" />
            <p className="text-white/60 text-lg font-medium uppercase tracking-[0.2em] leading-relaxed">
              Step into the world of bespoke craftsmanship and timeless elegance.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className="flex-grow h-full overflow-y-auto bg-white flex flex-col relative">
        
        {/* Mobile Header / Top Bar */}
        <div className="p-8 lg:p-12 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return</span>
          </button>
          
          <div className="lg:hidden">
            <Link to="/" className="text-xl font-black elegant-font tracking-tighter flex flex-col leading-none text-center">
              <span>shabil</span>
            </Link>
          </div>
          
          <div className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-gray-300">
            Secure Entry Portal
          </div>
        </div>

        {/* Content Centering Container */}
        <div className="flex-grow flex items-center justify-center p-8 md:p-16 lg:p-24">
          <div className="w-full max-w-md">
            
            <div className="mb-16">
              <div className="flex space-x-10 mb-12">
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`text-[10px] font-bold uppercase tracking-[0.4em] pb-3 transition-all relative ${isLogin ? 'text-primary' : 'text-gray-300'}`}
                >
                  Sign In
                  {isLogin && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />}
                </button>
                <button 
                  onClick={() => setIsLogin(false)}
                  className={`text-[10px] font-bold uppercase tracking-[0.4em] pb-3 transition-all relative ${!isLogin ? 'text-primary' : 'text-gray-300'}`}
                >
                  Register
                  {!isLogin && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />}
                </button>
              </div>
              
              <motion.h1 
                key={isLogin ? 'login-title' : 'reg-title'}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl font-black elegant-font uppercase tracking-tighter text-primary leading-none"
              >
                {isLogin ? 'Welcome \nBack.' : 'Join the \nMaison.'}
              </motion.h1>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest border-l-2 border-red-500"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <AnimatePresence mode='wait'>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative group"
                  >
                    <User size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Your Full Name" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-b border-gray-100 py-5 pl-10 text-sm font-medium focus:outline-none focus:border-primary transition-colors placeholder:text-gray-300"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <Mail size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-100 py-5 pl-10 text-sm font-medium focus:outline-none focus:border-primary transition-colors placeholder:text-gray-300"
                />
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Secret Password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-100 py-5 pl-10 pr-12 text-sm font-medium focus:outline-none focus:border-primary transition-colors placeholder:text-gray-300"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors z-[50] p-2 flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors">
                    Reset Password?
                  </button>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white py-8 flex items-center justify-between px-10 group hover:bg-black transition-all rounded-sm shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
                  {loading ? 'Processing...' : (isLogin ? 'Access Account' : 'Confirm Membership')}
                </span>
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform text-accent" />}
              </button>
            </form>

            <div className="mt-20 pt-10 border-t border-gray-50 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-8">Management Concierge</p>
              <button 
                onClick={handleAdminPrefill}
                className="inline-flex items-center space-x-3 text-accent hover:text-primary transition-colors"
              >
                <ShieldCheck size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest border-b border-transparent hover:border-primary pb-1">Enter Admin Portal</span>
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Footer Section for Auth */}
        <div className="p-12 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">
          © 2024 shabil • PRIVATE ACCESS
        </div>

      </div>
    </div>
  )
}

export default Auth
