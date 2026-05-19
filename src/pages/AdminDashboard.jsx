import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../utils/api'
import { products as localProducts } from '../data/products'
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Settings, 
  LogOut, Plus, Search, Filter, MoreVertical, TrendingUp, 
  ArrowUpRight, ArrowDownRight, DollarSign, Clock, CheckCircle,
  AlertCircle, Menu, X, ChevronRight, RefreshCw, Home, Loader2
} from 'lucide-react'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const mainContentRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData] = await Promise.all([
          api.getOrders()
        ])
        setProducts(localProducts)
        setOrders(Array.isArray(ordersData) ? ordersData : [])
        // Mock customers as they aren't fully implemented in backend yet
        setCustomers([
          { id: 'user-001', name: 'James Macharia', email: 'james@macharia.com', totalOrders: 12, totalSpent: 165000 },
          { id: 'user-002', name: 'Sarah Wanjiku', email: 'sarah.w@wanjiku.ke', totalOrders: 5, totalSpent: 85000 }
        ])
      } catch (error) {
        console.error('Dashboard data fetch failed:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

  if (!user || user.role !== 'admin') {
    navigate('/auth')
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Products', icon: Package },
    { label: 'Orders', icon: ShoppingCart },
    { label: 'Customers', icon: Users },
    { label: 'Settings', icon: Settings },
  ]

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `KSh ${(Array.isArray(orders) ? orders.reduce((acc, o) => acc + Number(o.total || 0), 0) / 1000 : 0).toFixed(1)}K`, 
      trend: '+12.5%', 
      icon: DollarSign, 
      positive: true 
    },
    { 
      label: 'Active Orders', 
      value: Array.isArray(orders) ? orders.filter(o => o.status !== 'Delivered').length : 0, 
      trend: '+4', 
      icon: ShoppingCart, 
      positive: true 
    },
    { 
      label: 'Total Customers', 
      value: Array.isArray(customers) ? customers.length : 0, 
      trend: '+18%', 
      icon: Users, 
      positive: true 
    },
    { 
      label: 'Low Stock Items', 
      value: Array.isArray(products) ? products.filter(p => p.stock < 10).length : 0, 
      trend: '-2', 
      icon: AlertCircle, 
      positive: false 
    },
  ]

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <Loader2 size={40} className="animate-spin text-accent" />
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400">Synchronizing Command Center...</p>
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
              <h1 className="text-5xl md:text-8xl font-black elegant-font uppercase tracking-tighter text-primary leading-none">Command</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4">System Administrator: {user.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-8 border border-gray-100 hover:border-accent transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-gray-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <stat.icon size={20} />
                    </div>
                    <div className={`flex items-center text-[10px] font-bold ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.trend}
                      {stat.positive ? <ArrowUpRight size={12} className="ml-1" /> : <ArrowDownRight size={12} className="ml-1" />}
                    </div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
                  <p className="text-3xl font-black elegant-font text-primary">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white p-10 border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Recent Orders</h3>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-accent border-b border-accent pb-1">View All</button>
                </div>
                <div className="space-y-6">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-bold text-primary">
                          {order.customerName?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary">{order.customerName}</p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{order.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-primary">KSh {order.total?.toLocaleString()}</p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-accent">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-10 border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Inventory Alerts</h3>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-accent border-b border-accent pb-1">Manage</button>
                </div>
                <div className="space-y-6">
                  {products.filter(p => p.stock < 15).slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                      <div className="flex items-center space-x-4">
                        <img src={product.images?.[0]} alt={product.name} className="w-10 h-10 object-cover bg-gray-50" />
                        <div>
                          <p className="text-sm font-bold text-primary uppercase">{product.name}</p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${product.stock < 10 ? 'text-red-500' : 'text-orange-500'}`}>{product.stock} left</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )
      case 'Products':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pt-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
              <div>
                <h1 className="text-5xl md:text-8xl font-black elegant-font uppercase tracking-tighter text-primary leading-none">Inventory</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4">{products.length} Items in Catalog</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100">
              <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="SEARCH COLLECTION..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-accent outline-none" />
                </div>
                <div className="flex items-center space-x-4">
                  <button className="p-4 bg-gray-50 text-primary hover:bg-gray-100 transition-colors">
                    <Filter size={18} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                      <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                      <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                      <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock Status</th>
                      <th className="p-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="p-8">
                          <div className="flex items-center space-x-6">
                            <img src={product.images?.[0]} alt={product.name} className="w-16 h-20 object-cover bg-gray-50" />
                            <div>
                              <p className="text-sm font-black text-primary uppercase">{product.name}</p>
                              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">ID: {product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{product.category}</span>
                        </td>
                        <td className="p-8">
                          <span className="text-sm font-black text-primary">KSh {product.price?.toLocaleString()}</span>
                        </td>
                        <td className="p-8">
                          <div className="flex flex-col">
                            <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${product.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
                              {product.stock} units
                            </span>
                            <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${product.stock < 10 ? 'bg-red-500' : 'bg-green-600'}`} 
                                style={{ width: `${Math.min(product.stock * 2, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-8 text-right">
                          <div className="flex items-center justify-end space-x-4">
                            <button className="text-gray-400 hover:text-primary transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )
      case 'Orders':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pt-10"
          >
            <h1 className="text-5xl md:text-8xl font-black elegant-font uppercase tracking-tighter text-primary leading-none">Registry</h1>
            <div className="bg-white border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID</th>
                      <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                      <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                      <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</th>
                      <th className="p-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="p-8 font-black text-primary uppercase tracking-tighter">{order.id}</td>
                        <td className="p-8">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-primary">{order.customerName}</span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{order.date}</span>
                          </div>
                        </td>
                        <td className="p-8">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-4 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-accent/10 text-accent'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-8 font-black text-primary">KSh {order.total?.toLocaleString()}</td>
                        <td className="p-8 text-right">
                          <button className="text-[10px] font-bold uppercase tracking-widest text-accent border-b border-accent pb-1">Manage</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )
      case 'Customers':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pt-10"
          >
            <h1 className="text-5xl md:text-8xl font-black elegant-font uppercase tracking-tighter text-primary leading-none">Clients</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {customers.map((customer) => (
                <div key={customer.id} className="bg-white p-10 border border-gray-100 hover:border-accent transition-all group">
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="w-16 h-16 bg-gray-50 flex items-center justify-center text-xl font-black text-primary">
                      {customer.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h4 className="text-xl font-black elegant-font text-primary uppercase leading-none">{customer.name}</h4>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-2">{customer.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-8">
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
                      <p className="text-lg font-black text-primary">{customer.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Spent</p>
                      <p className="text-lg font-black text-primary">KSh {customer.totalSpent?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )
      case 'Settings':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pt-10"
          >
            <h1 className="text-5xl md:text-8xl font-black elegant-font uppercase tracking-tighter text-primary leading-none">Config</h1>
            <div className="max-w-3xl bg-white p-10 border border-gray-100">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-10">Maison Admin Profile</h4>
              <form className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                    <input type="text" defaultValue={user.name} className="w-full bg-transparent border-b border-gray-100 py-3 text-sm font-bold text-primary focus:outline-none focus:border-accent" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Admin Email</label>
                    <input type="email" defaultValue={user.email} className="w-full bg-transparent border-b border-gray-100 py-3 text-sm font-bold text-primary focus:outline-none focus:border-accent" />
                  </div>
                </div>
                <div className="pt-6">
                  <button className="bg-primary text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent transition-colors">Update Registry</button>
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
      
      {/* Admin Sidebar */}
      <aside className={`fixed inset-y-0 left-0 xl:relative xl:translate-x-0 w-80 bg-white border-r border-gray-100 flex flex-col z-[190] p-10 transform transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-16 mt-10 xl:mt-0">
          <Link to="/" className="text-3xl font-black elegant-font tracking-tighter uppercase leading-none text-primary">Admin <span className="text-accent italic">Registry</span></Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mt-2">Maison Headquarters</p>
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
            <span className="text-[10px] font-bold uppercase tracking-widest">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        ref={mainContentRef}
        className="flex-grow flex flex-col h-screen overflow-hidden"
      >
        {/* Admin Header */}
        <header className="bg-white border-b border-gray-50 px-8 py-6 flex items-center justify-between xl:justify-end">
          <Link to="/" className="xl:hidden text-xl font-black elegant-font tracking-tighter uppercase text-primary">Admin Registry</Link>
          <div className="flex items-center space-x-6">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase text-primary leading-none">{user.name}</span>
                <span className="text-[8px] font-bold uppercase text-accent tracking-widest mt-1">Maison {user.role}</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-primary text-white border border-primary flex items-center justify-center font-black">
                {user.name?.charAt(0) || 'A'}
             </div>
             <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="xl:hidden p-3 bg-primary shadow-sm rounded-full text-white hover:bg-accent transition-all transform hover:scale-105 active:scale-95 ml-2"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto p-6 md:p-12 lg:p-20">
          <div className="max-w-7xl pb-20 mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Backdrop */}
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

export default AdminDashboard
