import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shabil_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('shabil_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem('shabil_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shabil_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, variant, quantity, variantPrice, selectedColor) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product.id && item.variantId === variant.id && item.selectedColor === selectedColor
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      const sizes = variant.sizes ? variant.sizes.split(',').map(s => s.trim()) : []
      const firstSize = sizes[0] || ''

      return [...prevCart, { 
        ...product, 
        variantId: variant.id, 
        selectedSize: firstSize, 
        selectedColor: selectedColor, 
        quantity,
        price: variantPrice || variant.prices?.[0],
        shippingTime: product.shippingTime
      }];
    });
  };

  const removeFromCart = (id, variantId) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === id && item.variantId === variantId)));
  };

  const updateQuantity = (id, variantId, delta) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === id && item.variantId === variantId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => wishlist.some(p => p.id === productId);

  return (
    <CartContext.Provider value={{ 
      cart, 
      wishlist, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      toggleWishlist, 
      isInWishlist 
    }}>
      {children}
    </CartContext.Provider>
  );
};
