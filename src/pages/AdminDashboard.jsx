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
  AlertCircle, Menu, X, ChevronRight, RefreshCw, Home, Loader2,
  ShoppingBag, User, Mail, Phone, MapPin, Calendar
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
  const [editingProduct, setEditingProduct] = useState(null)
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false)
  const mainContentRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, customersData] = await Promise.all([
          api.getOrders(),
          api.getCustomers()
        ])
        setProducts(localProducts)
        setOrders(Array.isArray(ordersData) ? ordersData : [])
        setCustomers(Array.isArray(customersData) ? customersData : [])
      } catch (error) {
        console.error('Dashboard data fetch failed:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order from the archive?')) {
      try {
        await api.deleteOrder(orderId)
        setOrders(orders.filter(o => o.id !== orderId))
      } catch (error) {
        alert('Failed to delete order: ' + error.message)
      }
    }
  }

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer? All their archive data will be terminated.')) {
      try {
        await api.deleteCustomer(customerId)
        setCustomers(customers.filter(c => c.id !== customerId))
      } catch (error) {
        alert('Failed to delete customer: ' + error.message)
      }
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } catch (error) {
      alert('Failed to update status: ' + error.message)
    }
  }

  const handleInventoryUpdate = async (e) => {
    e.preventDefault();
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    );
    setProducts(updatedProducts);
    setIsInventoryModalOpen(false);
    // Note: In a real app, you would also call an API here
    // await api.updateProduct(editingProduct.id, editingProduct);
    alert('Archive updated successfully');
  };

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

            {products.length === 0 ? (
              <div className="bg-white border border-gray-100 p-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-gray-50 flex items-center justify-center text-gray-300">
                  <Package size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black elegant-font uppercase text-primary">No Products Found</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 max-w-xs mx-auto">
                    The inventory is currently empty. Add products to the archive to see them listed here.
                  </p>
                </div>
              </div>
            ) : (
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
                              <button 
                                onClick={() => {
                                  setEditingProduct(product);
                                  setIsInventoryModalOpen(true);
                                }}
                                className="text-[10px] font-bold uppercase tracking-widest text-accent border-b border-accent pb-1"
                              >
                                Edit Inventory
                              </button>
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
            )}
          </motion.div>
        )
      case 'Orders':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pt-10"
          >
            <div className="flex justify-between items-end mb-4">
              <div>
                <h1 className="text-5xl md:text-8xl font-black elegant-font uppercase tracking-tighter text-primary leading-none">Registry</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4">{orders.length} Transaction Records</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white border border-gray-100 p-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-gray-50 flex items-center justify-center text-gray-300">
                  <ShoppingBag size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black elegant-font uppercase text-primary">No Records Found</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 max-w-xs mx-auto">
                    The archive is currently empty. All future transactions will be recorded here automatically.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID</th>
                        <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer Details</th>
                        <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status & Payment</th>
                        <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Financials</th>
                        <th className="p-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/10 transition-colors group">
                          <td className="p-8">
                            <div className="flex flex-col">
                              <span className="font-black text-primary uppercase tracking-tighter text-lg">{order.order_number || order.id?.substring(0, 8)}</span>
                              <div className="flex items-center text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                <Calendar size={10} className="mr-1" />
                                {new Date(order.date || order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                          </td>
                          <td className="p-8">
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-primary/5 flex items-center justify-center text-[10px] font-black text-primary">
                                  {order.customer_name?.charAt(0) || 'C'}
                                </div>
                                <span className="text-sm font-bold text-primary">{order.customer_name}</span>
                              </div>
                              <div className="flex flex-col space-y-0.5 pl-8">
                                <div className="flex items-center text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                                  <Mail size={10} className="mr-2" /> {order.customer_email || 'N/A'}
                                </div>
                                <div className="flex items-center text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                                  <MapPin size={10} className="mr-2" /> {order.city || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-8">
                            <div className="flex flex-col space-y-3">
                              <span className={`text-[8px] w-fit font-black uppercase tracking-[0.2em] px-4 py-1.5 border ${
                                order.status === 'Delivered' ? 'border-green-500 text-green-600 bg-green-50' : 
                                order.status === 'Cancelled' ? 'border-red-500 text-red-500 bg-red-50' :
                                'border-accent text-accent bg-accent/5'
                              }`}>
                                {order.status || 'Processing'}
                              </span>
                              <div className="flex flex-col space-y-1">
                                <span className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center">
                                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${order.payment_option === 'delivery_only' ? 'bg-orange-400' : 'bg-green-500'}`} />
                                  {order.payment_option === 'delivery_only' ? 'Partial Payment' : 'Full Payment'}
                                </span>
                                {order.payment_option === 'delivery_only' && (
                                  <span className="text-[8px] font-bold uppercase text-orange-500 tracking-tighter ml-3.5">
                                    Balance Due: KSh {order.balance_due?.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-8">
                            <div className="flex flex-col">
                              <div className="flex items-baseline space-x-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">KSh</span>
                                <span className="text-lg font-black text-primary leading-none">{order.total?.toLocaleString()}</span>
                              </div>
                              <div className="flex flex-col mt-2 space-y-0.5">
                                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Deposit: KSh {order.amount_paid?.toLocaleString()}</span>
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Method: {order.payment_method || 'M-PESA'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-8 text-right">
                            <div className="flex items-center justify-end space-x-6">
                              <div className="flex flex-col items-end">
                                <label className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity">Action</label>
                                <select 
                                  value={order.status}
                                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                  className="text-[10px] font-bold uppercase tracking-widest bg-transparent border-b border-accent/30 focus:border-accent focus:outline-none py-1 cursor-pointer"
                                >
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="In Transit">In Transit</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                              <button 
                                onClick={() => handleDeleteOrder(order.id)}
                                className="w-10 h-10 flex items-center justify-center border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-100 transition-all rounded-sm"
                                title="Delete Record"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )
      case 'Customers':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pt-10"
          >
            <div className="flex justify-between items-end mb-4">
              <div>
                <h1 className="text-5xl md:text-8xl font-black elegant-font uppercase tracking-tighter text-primary leading-none">Clients</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4">{customers.length} Verified Members</p>
              </div>
            </div>

            {customers.length === 0 ? (
              <div className="bg-white border border-gray-100 p-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-gray-50 flex items-center justify-center text-gray-300">
                  <User size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black elegant-font uppercase text-primary">No Clients Registered</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 max-w-xs mx-auto">
                    The client directory is currently empty. New members will appear here after registration.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Identity</th>
                        <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact Information</th>
                        <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Activity</th>
                        <th className="text-left p-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Investment</th>
                        <th className="p-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {customers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50/10 transition-colors group">
                          <td className="p-8">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary flex items-center justify-center text-white text-lg font-black">
                                {customer.name?.charAt(0) || 'C'}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-primary uppercase">{customer.name}</span>
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {customer.id?.substring(0, 8)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-8">
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center text-[10px] font-bold text-primary">
                                <Mail size={12} className="mr-2 text-accent" /> {customer.email}
                              </div>
                              <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <Phone size={12} className="mr-2 text-accent" /> {customer.phone || 'NO PHONE RECORDED'}
                              </div>
                            </div>
                          </td>
                          <td className="p-8">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-primary uppercase">{customer.totalOrders || 0} ORDERS</span>
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Active Participant</span>
                            </div>
                          </td>
                          <td className="p-8">
                            <div className="flex items-baseline space-x-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">KSh</span>
                              <span className="text-lg font-black text-primary leading-none">{customer.totalSpent?.toLocaleString() || '0'}</span>
                            </div>
                          </td>
                          <td className="p-8 text-right">
                            <button 
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="w-10 h-10 flex items-center justify-center border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-100 transition-all rounded-sm"
                              title="Terminate Account"
                            >
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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

      {/* Inventory Modal */}
      <AnimatePresence>
        {isInventoryModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white max-w-2xl w-full p-12 shadow-2xl space-y-10"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black elegant-font uppercase tracking-tighter">Manage Inventory</h2>
                <button onClick={() => setIsInventoryModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleInventoryUpdate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Base Price (KSh)</label>
                    <input 
                      type="number" 
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})}
                      className="w-full border-b border-gray-100 py-3 text-sm font-bold focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Stock Units</label>
                    <input 
                      type="number" 
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                      className="w-full border-b border-gray-100 py-3 text-sm font-bold focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Archive Category</label>
                  <select 
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold focus:outline-none focus:border-accent bg-transparent"
                  >
                    <option value="Croptops">Croptops</option>
                    <option value="Leather Jackets">Leather Jackets</option>
                    <option value="Leather Dress">Leather Dress</option>
                    <option value="Trousers">Trousers</option>
                    <option value="Sweatpants">Sweatpants</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full h-16 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-accent transition-all shadow-xl"
                >
                  Update Archive Registry
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
