import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { ShoppingBag, Search, User, Menu, X, Instagram, ArrowRight, Heart } from 'lucide-react'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ThankYou from './pages/ThankYou'
import Wishlist from './pages/Wishlist'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import StoreLocator from './pages/StoreLocator'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import ShippingPolicy from './pages/ShippingPolicy'
import RefundsPolicy from './pages/RefundsPolicy'
import Collection from './pages/Collection'
import ScrollToTop from './components/ScrollToTop'
import { motion, AnimatePresence } from 'framer-motion'
import { CartProvider, useCart } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/auth" />
  if (role && user.role !== role) return <Navigate to="/" />
  return children
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const { cart, wishlist } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistCount = wishlist.length

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setIsSearchOpen(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`)
      setIsSearchOpen(false)
    }
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-white py-4 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-3 items-center">
            
            {/* Left: Navigation links */}
            <div className="flex lg:flex items-center">
              <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 -ml-2">
                <Menu size={20} strokeWidth={1.5} />
              </button>
              <div className="hidden lg:flex items-center space-x-10">
                <Link to="/products" className="group relative overflow-hidden text-[10px] font-bold uppercase tracking-[0.3em]">
                  <span className="block group-hover:-translate-y-full transition-transform duration-500">Shop</span>
                  <span className="absolute top-full left-0 block group-hover:-translate-y-full transition-transform duration-500 text-accent">Shop</span>
                </Link>
                <Link to="/products?category=Croptops" className="group relative overflow-hidden text-[10px] font-bold uppercase tracking-[0.3em]">
                  <span className="block group-hover:-translate-y-full transition-transform duration-500">Croptops</span>
                  <span className="absolute top-full left-0 block group-hover:-translate-y-full transition-transform duration-500 text-accent">Croptops</span>
                </Link>
                <Link to="/products?category=Leather Jackets" className="group relative overflow-hidden text-[10px] font-bold uppercase tracking-[0.3em]">
                  <span className="block group-hover:-translate-y-full transition-transform duration-500">Leather</span>
                  <span className="absolute top-full left-0 block group-hover:-translate-y-full transition-transform duration-500 text-accent">Leather</span>
                </Link>
                <Link to="/products?category=Leather Dress" className="group relative overflow-hidden text-[10px] font-bold uppercase tracking-[0.3em]">
                  <span className="block group-hover:-translate-y-full transition-transform duration-500">Dresses</span>
                  <span className="absolute top-full left-0 block group-hover:-translate-y-full transition-transform duration-500 text-accent">Dresses</span>
                </Link>
                <Link to="/products?category=Trousers" className="group relative overflow-hidden text-[10px] font-bold uppercase tracking-[0.3em]">
                  <span className="block group-hover:-translate-y-full transition-transform duration-500">Trousers</span>
                  <span className="absolute top-full left-0 block group-hover:-translate-y-full transition-transform duration-500 text-accent">Trousers</span>
                </Link>
              </div>
            </div>

            {/* Center: Brand Name (Logo) */}
            <div className="flex justify-center">
              <Link to="/" className="flex items-center group relative overflow-hidden py-2 px-4">
                <div className="flex overflow-hidden relative">
                  {"SHABIL".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ y: 0 }}
                      whileHover={{ y: "-100%" }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.03, 
                        ease: [0.6, 0.01, -0.05, 0.95] 
                      }}
                      className="text-2xl md:text-4xl font-black elegant-font tracking-tighter leading-none relative block"
                    >
                      <span className="block">{char}</span>
                      <span className="absolute top-full left-0 block text-accent">{char}</span>
                    </motion.span>
                  ))}
                </div>
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-left"
                />
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex justify-end items-center space-x-4 md:space-x-10">
              <button onClick={() => setIsSearchOpen(true)} className="hover:text-accent transition-colors">
                <Search size={18} strokeWidth={1.5} />
              </button>
              <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/auth'} className="hover:text-accent transition-colors">
                <User size={18} strokeWidth={1.5} />
              </Link>
              <Link to="/wishlist" className="relative hover:text-accent transition-colors">
                <Heart size={18} strokeWidth={1.5} className={wishlistCount > 0 ? "text-red-500 fill-red-500" : ""} />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlistCount}</span>
              </Link>
              <Link to="/cart" className="relative p-2 hover:text-accent transition-colors">
                <ShoppingBag size={18} strokeWidth={1.5} />
                <span className="absolute top-0 right-0 bg-primary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartItemCount}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[110] bg-white flex flex-col"
          >
            <div className="p-8 flex justify-end">
              <button onClick={() => setIsOpen(false)}>
                <X size={32} strokeWidth={1} />
              </button>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center space-y-8">
              {['Home', 'Shop', 'Croptops', 'Leather Jackets', 'Leather Dress', 'Trousers', 'Sweatpants'].map((item, i) => (
                <Link 
                  key={item} 
                  to={item === 'Home' ? '/' : item === 'Shop' ? '/products' : `/products?category=${item}`}
                  className="text-4xl md:text-6xl font-black elegant-font hover:text-accent transition-colors uppercase tracking-tighter"
                >
                  {item}
                </Link>
              ))}
            </div>
            <div className="p-12 flex justify-center space-x-8 border-t border-gray-100">
              <a href="https://www.instagram.com/shabil/" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} className="text-gray-400 hover:text-accent transition-colors" />
              </a>
              <a href="https://www.tiktok.com/@shabil" target="_blank" rel="noopener noreferrer">
                <svg 
                  viewBox="0 0 24 24" 
                  width="20" 
                  height="20" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-white flex items-center justify-center p-6"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-12 right-12 hover:rotate-90 transition-transform"
            >
              <X size={40} strokeWidth={1} />
            </button>
            <form onSubmit={handleSearch} className="w-full max-w-4xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mb-8 text-center">What are you looking for?</p>
              <input 
                type="text" 
                placeholder="Search our collections..." 
                className="w-full bg-transparent border-b border-gray-200 py-6 text-4xl md:text-6xl font-black elegant-font text-center focus:outline-none focus:border-primary transition-colors"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="mt-12 flex justify-center space-x-4">
                {['Dresses', 'Gowns', 'Silk', 'Velvet'].map(tag => (
                  <button 
                    key={tag}
                    type="button"
                    onClick={() => {setSearchQuery(tag); navigate(`/products?search=${tag}`)}}
                    className="text-[10px] font-bold uppercase tracking-widest border border-gray-100 px-6 py-2 hover:bg-primary hover:text-white transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const Footer = () => (
  <footer className="bg-[#050505] text-white pt-40 pb-12 overflow-hidden relative">
    {/* Dynamic Background Text - More Layers */}
    <div className="absolute top-10 left-0 w-full overflow-hidden pointer-events-none select-none opacity-[0.03] whitespace-nowrap">
      <div className="text-[25vw] font-black elegant-font leading-none flex animate-marquee">
        <span className="mx-10">Shabil</span>
        <span className="mx-10">NAIROBI ARCHIVE</span>
      </div>
    </div>
    <div className="absolute bottom-20 right-0 w-full overflow-hidden pointer-events-none select-none opacity-[0.02] whitespace-nowrap">
      <div className="text-[20vw] font-black elegant-font leading-none flex animate-marquee-reverse">
        <span className="mx-10">NAIROBI DESIGN</span>
        <span className="mx-10">LUXURY CRAFT</span>
      </div>
    </div>

    <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-40">
        
        {/* Brand Statement */}
        <div className="lg:col-span-6 space-y-16">
          <Link to="/" className="block group">
            <img src="https://i.imgur.com/QPJRRvJ.png" alt="Logo" className="h-24 md:h-40 w-auto object-contain brightness-0 invert" />
          </Link>
          <div className="space-y-6">
            <div className="w-20 h-1 bg-accent" />
          </div>
          <div className="flex space-x-12">
            {[
              { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/shabil/' }, 
              { 
                icon: (props) => (
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    {...props}
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                ), 
                label: 'TikTok', 
                url: 'https://www.tiktok.com/@shabil' 
              }
            ].map((social) => (
              <a 
                key={social.label} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex flex-col space-y-3 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 hover:text-white transition-all"
              >
                <social.icon size={24} className="group-hover:text-accent group-hover:-translate-y-1 transition-all" />
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-accent mb-10">The Collections</h3>
              <ul className="space-y-8">
                {[
                  { name: 'All Pieces', path: '/products' },
                  { name: 'Croptops', path: '/products?category=Croptops' },
                  { name: 'Leather Jackets', path: '/products?category=Leather Jackets' },
                  { name: 'Leather Dress', path: '/products?category=Leather Dress' },
                  { name: 'Trousers', path: '/products?category=Trousers' },
                  { name: 'Sweatpants', path: '/products?category=Sweatpants' }
                ].map(link => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-white transition-all group flex items-center">
                      <span className="w-0 group-hover:w-8 h-[1px] bg-accent transition-all duration-300 mr-0 group-hover:mr-4" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-accent mb-10">The Maison</h3>
              <ul className="space-y-8">
                {[
                  { name: 'Our Heritage', path: '/about' },
                  { name: 'Inquiries', path: '/contact' },
                  { name: 'Showrooms', path: '/store-locator' }
                ].map(link => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-white transition-all group flex items-center">
                      <span className="w-0 group-hover:w-8 h-[1px] bg-accent transition-all duration-300 mr-0 group-hover:mr-4" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-accent mb-10">Registry</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest leading-loose mb-10">
                Join the inner circle for private access to our limited releases and bespoke services.
              </p>
              <form className="relative group">
                <input 
                  type="email" 
                  placeholder="IDENTITY@EMAIL.COM" 
                  className="w-full bg-transparent border-b-2 border-gray-900 py-6 text-[10px] font-black tracking-[0.4em] focus:outline-none focus:border-accent transition-all placeholder:text-gray-800"
                />
                <button className="absolute right-0 bottom-6 text-accent hover:text-white transition-all transform hover:translate-x-2">
                  <ArrowRight size={24} />
                </button>
              </form>
            </div>
            
            <div className="pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mb-6">Maison Headquarters</p>
              <p className="text-xs text-gray-400 font-serif italic leading-relaxed">
                Nairobi Design District<br/>
                Westlands, 4th Avenue<br/>
                Kenya
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-16 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 items-center gap-12">
        {/* Left: Copyright */}
        <div className="text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">
            © 2026 Shabil • ALL RIGHTS RESERVED
          </p>
        </div>

        {/* Center: Policy Links */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
          {[
            { name: 'Privacy', path: '/privacy-policy' },
            { name: 'Terms of Service', path: '/terms-of-service' },
            { name: 'Shipping', path: '/shipping-policy' },
            { name: 'Refunds', path: '/refunds-policy' }
          ].map(item => (
            <Link key={item.name} to={item.path} className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-white transition-all">
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* Right: Mastered by */}
        <div className="flex justify-center md:justify-end items-center space-x-3 group cursor-default">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Mastered by</span>
          <a 
            href="https://iyonicorp.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-black uppercase tracking-[0.5em] text-accent hover:text-white transition-all transform hover:scale-105 inline-block"
          >
            iyonicorp
          </a>
        </div>
      </div>
    </div>
  </footer>
)

function App() {
  const location = useLocation()
  const isDashboardPath = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')
  const isAdminPath = location.pathname.startsWith('/admin')

  return (
    <AuthProvider>
      <CartProvider>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col selection:bg-accent selection:text-white">
          {!isDashboardPath && <Navbar />}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/new-arrivals" element={<Collection title="New Arrivals" description="The Latest Creations" category="All" />} />
              <Route path="/gala-edit" element={<Collection title="Gala Edit" description="The Art of the Evening" category="Gala" />} />
              <Route path="/evening-luxe" element={<Collection title="Evening Luxe" description="Nighttime Sophistication" category="Evening" />} />
              
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/store-locator" element={<StoreLocator />} />
              
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/refunds-policy" element={<RefundsPolicy />} />

              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={
                <ProtectedRoute role="user">
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/thank-you" element={<ThankYou />} />
            </Routes>
          </main>
          {!isDashboardPath && <Footer />}
        </div>
      </CartProvider>
  </AuthProvider>
)
}

export default App
