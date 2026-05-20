import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../utils/api'
import { 
  ShoppingBag, Heart, User, Settings, LogOut, Package, MapPin, 
  CreditCard, ChevronRight, Bell, Search, Star, Clock, Plus, DollarSign, Menu, X, Home, Loader2
} from 'lucide-react'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [claimOrderNumber, setClaimOrderNumber] = useState('')
  const [claimStatus, setClaimStatus] = useState({ loading: false, message: '', error: '' })
  const mainContentRef = useRef(null)

  const handleClaimOrder = async (e) => {
    e.preventDefault()
    setClaimStatus({ loading: true, message: '', error: '' })
    try {
      const response = await api.claimOrder({
        order_number: claimOrderNumber,
        user_id: user.id
      })
      setClaimStatus({ loading: false, message: response.message, error: '' })
      setClaimOrderNumber('')
      // Refresh orders
      const ordersData = await api.getOrders(user.id)
      setOrders(ordersData)
    } catch (error) {
      setClaimStatus({ loading: false, message: '', error: error.message || 'Failed to claim order' })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const ordersData = await api.getOrders(user.id)
          setOrders(ordersData)
          
          // Wishlist is still locally managed in CartContext, but we can display it here
          const savedWishlist = localStorage.getItem('maison_wishlist')
          setWishlist(savedWishlist ? JSON.parse(savedWishlist) : [])
        } catch (error) {
          console.error('Failed to fetch dashboard data:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchData()
  }, [user])

  // Slide to top effect when tab changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Only close sidebar automatically on mobile
    if (window.innerWidth < 1280) {
      setIsSidebarOpen(false);
    }
  }, [activeTab])

  if (!user) {
    navigate('/auth')
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { label: 'Overview', icon: User },
    { label: 'My Orders', icon: Package },
    { label: 'Claim Order', icon: Search },
    { label: 'Wishlist', icon: Heart },
    { label: 'Addresses', icon: MapPin },
    { label: 'Payment Methods', icon: CreditCard },
    { label: 'Account Settings', icon: Settings },
  ]

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <Loader2 size={40} className="animate-spin text-accent" />
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400">Loading Profile...</p>
        </div>
      )
    }
    switch (activeTab) {
      case 'Overview':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pt-10"
          >
            <div className="mb-12">
              <h1 className="text-5xl md:text-8xl font-black elegant-font uppercase tracking-tighter text-primary leading-none">{activeTab}</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4">Welcome back, {user.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Total Spent', value: `KSh ${orders.reduce((acc, o) => acc + Number(o.total), 0).toLocaleString()}`, icon: DollarSign },
                { label: 'Active Orders', value: orders.filter(o => o.status !== 'Delivered').length, icon: Package },
                { label: 'Wishlist Pieces', value: wishlist.length, icon: Heart },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-10 shadow-sm border border-gray-100 hover:border-accent transition-colors group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-gray-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      {stat.icon ? <stat.icon size={20} /> : <ShoppingBag size={20} />}
                    </div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
                  <p className="text-4xl font-black elegant-font text-primary">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-10 border border-gray-100">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-10">Membership Status</h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center space-x-8">
                  <div className="w-24 h-24 rounded-full border-4 border-accent flex items-center justify-center">
                    <Star size={32} className="text-accent fill-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-black elegant-font text-primary uppercase">Gold Tier</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Nairobi Design Circle Member</p>
                  </div>
                </div>
                <div className="flex-grow max-w-md w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-accent h-full w-[75%]" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">750 Points to Platinum</p>
              </div>
            </div>
          </motion.div>
        )
      case 'My Orders':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pt-10"
          >
            <h1 className="text-5xl md:text-8xl font-black elegant-font uppercase tracking-tighter text-primary leading-none">{activeTab}</h1>
            <div className="bg-white border border-gray-100 overflow-hidden">
              <div className="p-10 border-b border-gray-50">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Order History</h3>
              </div>
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID</th>
                        <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                        <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                        <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</th>
                        <th className="p-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-8 font-black elegant-font text-primary">{order.order_number || order.id}</td>
                          <td className="p-8 text-sm font-medium text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="p-8">
                            <div className="flex flex-col space-y-2">
                              <span className={`text-[8px] w-fit font-black uppercase tracking-widest px-4 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-accent/10 text-accent'}`}>
                                {order.status || 'Processing'}
                              </span>
                              {order.balance_due > 0 && (
                                <span className="text-[7px] font-bold uppercase text-orange-500">Balance Due: KSh {order.balance_due.toLocaleString()}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-8">
                            <div className="flex flex-col">
                              <span className="font-black text-primary">KSh {order.total.toLocaleString()}</span>
                              <span className="text-[7px] font-bold text-gray-400 uppercase">Paid: KSh {order.amount_paid?.toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="p-8 text-right">
                            <button className="text-[10px] font-bold uppercase tracking-widest text-accent border-b border-accent pb-1 text-nowrap">Track Piece</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-20 text-center">
                  <Package size={40} className="text-gray-200 mx-auto mb-6" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No orders placed yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )
      case 'Claim Order':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pt-10"
          >
            <h1 className="text-5xl md:text-8xl font-black elegant-font uppercase tracking-tighter text-primary leading-none">{activeTab}</h1>
            <div className="max-w-xl bg-white p-10 border border-gray-100 space-y-10">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Claim Past Guest Order</h3>
                <p className="text-sm font-serif italic text-gray-500 leading-relaxed">
                  Purchased as a guest? Enter your Order Number from your digital receipt to link it to your account.
                </p>
              </div>

              <form onSubmit={handleClaimOrder} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order Number</label>
                  <input 
                    type="text" 
                    value={claimOrderNumber}
                    onChange={(e) => setClaimOrderNumber(e.target.value.toUpperCase())}
                    placeholder="ORD-XXXXXXX" 
                    required
                    className="w-full bg-transparent border-b border-gray-100 py-3 text-sm font-bold text-primary focus:outline-none focus:border-accent placeholder:text-gray-200" 
                  />
                </div>

                <button 
                  type="submit"
                  disabled={claimStatus.loading}
                  className="w-full h-16 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-accent transition-all flex items-center justify-center disabled:bg-gray-200"
                >
                  {claimStatus.loading ? <Loader2 className="animate-spin mr-2" size={16} /> : 'Claim Archive'}
                </button>
              </form>

              {claimStatus.message && (
                <div className="p-6 bg-green-50 border border-green-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">{claimStatus.message}</p>
                </div>
              )}

              {claimStatus.error && (
                <div className="p-6 bg-red-50 border border-red-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">{claimStatus.error}</p>
                </div>
              )}
            </div>
          </motion.div>
        )
      case 'Wishlist':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pt-10"
          >
            <h1 className="text-5xl md:text-8xl font-black elegant-font uppercase tracking-tighter text-primary leading-none">{activeTab}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {wishlist.length > 0 ? wishlist.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 p-6 flex items-center space-x-6">
                  <img src={item.images[0]} alt={item.name} className="w-24 h-32 object-cover bg-gray-50" />
                  <div className="flex-grow">
                    <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-accent mb-2">{item.category}</p>
                    <h4 className="text-xl font-black elegant-font text-primary uppercase leading-none mb-4">{item.name}</h4>
                    <p className="text-sm font-bold text-primary mb-4">KSh {item.price.toLocaleString()}</p>
                    <button className="text-[10px] font-bold uppercase tracking-widest border border-primary px-4 py-2 hover:bg-primary hover:text-white transition-all">Move to Bag</button>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 bg-white border border-gray-100 text-center">
                  <Heart size={40} className="text-gray-200 mx-auto mb-6" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your wishlist is empty</p>
                </div>
              )}
            </div>
          </motion.div>
        )
      case 'Addresses':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pt-10"
          >
            <h1 className="text-5xl md:text-8xl font-black elegant-font uppercase tracking-tighter text-primary leading-none">{activeTab}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 border border-gray-100 relative">
                <div className="absolute top-8 right-8 text-[8px] font-black uppercase tracking-widest text-accent">Default</div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-8">Shipping Address</h4>
                <div className="space-y-2 text-sm text-gray-600 font-medium">
                  <p className="text-primary font-bold">{user.name}</p>
                  <p>Nairobi Design District</p>
                  <p>Westlands, Block 4</p>
                  <p>Nairobi, Kenya</p>
                  <p>+254 700 000 000</p>
                </div>
                <button className="mt-8 text-[10px] font-bold uppercase tracking-widest border-b border-gray-200 hover:border-primary transition-all pb-1">Edit Address</button>
              </div>
              <button className="border-2 border-dashed border-gray-100 p-10 flex flex-col items-center justify-center group hover:border-accent transition-colors">
                <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Plus size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Add New Address</span>
              </button>
            </div>
          </motion.div>
        )
      case 'Payment Methods':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pt-10"
          >
            <h1 className="text-5xl md:text-8xl font-black elegant-font uppercase tracking-tighter text-primary leading-none">{activeTab}</h1>
            <div className="max-w-2xl bg-white p-10 border border-gray-100">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-10">Saved Methods</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 border border-gray-50 bg-gray-50/30">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-8 bg-[#1a1a1a] rounded flex items-center justify-center text-[8px] text-white font-bold italic">VISA</div>
                    <div>
                      <p className="text-sm font-bold text-primary">•••• •••• •••• 4242</p>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Expires 12/26</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors">Remove</button>
                </div>
                <button className="w-full py-6 border-2 border-dashed border-gray-100 flex items-center justify-center space-x-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-accent hover:text-accent transition-all">
                  <Plus size={16} />
                  <span>Add New Card / M-Pesa</span>
                </button>
              </div>
            </div>
          </motion.div>
        )
      case 'Account Settings':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pt-10"
          >
            <h1 className="text-5xl md:text-8xl font-black elegant-font uppercase tracking-tighter text-primary leading-none">{activeTab}</h1>
            <div className="max-w-3xl bg-white p-10 border border-gray-100">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-10">Maison Profile</h4>
              <form className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                    <input type="text" defaultValue={user.name} className="w-full bg-transparent border-b border-gray-100 py-3 text-sm font-bold text-primary focus:outline-none focus:border-accent" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                    <input type="email" defaultValue={user.email} className="w-full bg-transparent border-b border-gray-100 py-3 text-sm font-bold text-primary focus:outline-none focus:border-accent" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Preferred Language</label>
                  <select className="w-full bg-transparent border-b border-gray-100 py-3 text-sm font-bold text-primary focus:outline-none focus:border-accent">
                    <option>English</option>
                    <option>Swahili</option>
                    <option>French</option>
                  </select>
                </div>
                <div className="pt-6">
                  <button className="bg-primary text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent transition-colors">Save Changes</button>
                </div>
              </form>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex overflow-hidden">
      
      {/* Unified Sidebar */}
      <aside className={`fixed inset-y-0 left-0 xl:relative xl:translate-x-0 w-80 bg-white border-r border-gray-100 flex flex-col z-[190] p-10 transform transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-16 mt-10 xl:mt-0">
          <Link to="/" className="flex items-center">
            <img src="https://i.imgur.com/QPJRRvJ.png" alt="MAISON KENYA" className="h-12 w-auto object-contain" />
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mt-4">Personal Office</p>
        </div>

        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center justify-between p-5 rounded-sm transition-all group ${activeTab === item.label ? 'bg-primary text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <div className="flex items-center space-x-5">
                <item.icon size={18} strokeWidth={activeTab === item.label ? 2.5 : 1.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </div>
              <ChevronRight size={14} className={`transition-transform ${activeTab === item.label ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
            </button>
          ))}
          
          <div className="pt-8 mt-8 border-t border-gray-50">
            <Link 
              to="/"
              className="w-full flex items-center space-x-5 p-5 text-gray-400 hover:bg-accent hover:text-white transition-all group rounded-sm"
            >
              <Home size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Back to Shop</span>
            </Link>
          </div>
        </nav>

        <div className="pt-10 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-5 text-gray-400 hover:text-red-500 transition-colors px-5"
          >
            <LogOut size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        ref={mainContentRef}
        className="flex-grow flex flex-col h-screen overflow-hidden"
      >
        {/* Simple Header */}
        <header className="bg-white border-b border-gray-50 px-8 py-6 flex items-center justify-between xl:justify-end">
          <Link to="/" className="xl:hidden">
            <img src="https://i.imgur.com/QPJRRvJ.png" alt="Logo" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center space-x-6">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase text-primary leading-none">{user.name}</span>
                <span className="text-[8px] font-bold uppercase text-accent tracking-widest mt-1">{user.role}</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-primary font-black">
                {user.name.charAt(0)}
             </div>
             <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="xl:hidden p-3 bg-white shadow-sm border border-gray-100 rounded-full text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-105 active:scale-95 ml-2"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto p-6 md:p-12 lg:p-20">
          <div className="max-w-6xl pb-20 mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Mobile Overlay Background */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="xl:hidden fixed inset-0 bg-black/50 z-[180]"
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dashboard
