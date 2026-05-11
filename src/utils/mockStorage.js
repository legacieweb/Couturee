import { products as initialProducts } from '../data/products';

const STORAGE_KEYS = {
  PRODUCTS: 'shabil_mock_products',
  ORDERS: 'shabil_mock_orders',
  USERS: 'shabil_mock_users',
  WISHLIST: 'shabil_mock_wishlist'
};

export const initializeMockStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    // Add a total stock property for easier dashboard management
    const productsWithStock = initialProducts.map(p => ({
      ...p,
      stock: p.variants ? p.variants.reduce((acc, v) => acc + v.stock, 0) : 20
    }));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsWithStock));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    const mockOrders = [
      { id: '#ORD-7721', userId: 'user-001', date: 'Oct 12, 2024', status: 'Delivered', total: 45000, items: initialProducts.slice(0, 1) },
      { id: '#ORD-7605', userId: 'user-001', date: 'Sep 28, 2024', status: 'In Transit', total: 120000, items: initialProducts.slice(1, 2) },
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mockOrders));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
};

export const getProducts = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
export const updateProduct = (updatedProduct) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === updatedProduct.id);
  if (index !== -1) {
    products[index] = updatedProduct;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }
};

export const getOrders = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
export const getMyOrders = (userId) => getOrders().filter(o => o.userId === userId);

export const getCustomers = () => [
  { id: 'user-001', name: 'James Macharia', email: 'james@macharia.com', totalOrders: 12, totalSpent: 165000 },
  { id: 'user-002', name: 'Sarah Wanjiku', email: 'sarah.w@wanjiku.ke', totalOrders: 5, totalSpent: 85000 },
  { id: 'user-003', name: 'David Omondi', email: 'david@omondi.com', totalOrders: 3, totalSpent: 42000 },
];

export const updateProductStock = (productId, amount) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === productId);
  if (index !== -1) {
    products[index].stock += amount;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return products[index];
  }
  return null;
};

export const addRestockLog = (productId, amount, adminName) => {
  console.log(`[RESTOCK] ${adminName} added ${amount} units to product ${productId}`);
  // In a real app, this would be saved to a database or separate log storage
};

export const getWishlist = (userId) => {
  const allWishlists = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '{}');
  return allWishlists[userId] || [];
};

export const toggleWishlist = (userId, product) => {
  const allWishlists = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '{}');
  const userWishlist = allWishlists[userId] || [];
  const exists = userWishlist.find(p => p.id === product.id);
  
  if (exists) {
    allWishlists[userId] = userWishlist.filter(p => p.id !== product.id);
  } else {
    allWishlists[userId] = [...userWishlist, product];
  }
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(allWishlists));
  return allWishlists[userId];
};
