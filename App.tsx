import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, ShoppingBag } from 'lucide-react';
import { PRODUCTS, STORE_NAME } from './constants';
import { CartItem, Product } from './types';
import HomePage from './components/HomePage';
import ShopPage from './components/ShopPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import CartSidebar from './components/CartSidebar';
import CheckoutModal from './components/CheckoutModal';
import AiAssistant from './components/AiAssistant';

// Search Handler Component to access navigation context
const NavigationBar: React.FC<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cartCount: number;
  openCart: () => void;
}> = ({ searchTerm, setSearchTerm, cartCount, openCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // If user types in search and is not on shop page, go to shop page
    if (e.target.value.length > 0 && location.pathname !== '/shop') {
      navigate('/shop');
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-panther-900/95 backdrop-blur-md border-b border-panther-700 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-panther-accent rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-purple-500/20">
              <span className="text-white font-black text-xl">B</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tighter text-white uppercase hidden sm:block">
              {STORE_NAME}
            </h1>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 mx-8">
            <Link to="/" className={`font-medium hover:text-panther-accent transition-colors ${location.pathname === '/' ? 'text-white' : 'text-gray-400'}`}>Home</Link>
            <Link to="/shop" className={`font-medium hover:text-panther-accent transition-colors ${location.pathname === '/shop' ? 'text-white' : 'text-gray-400'}`}>Shop All</Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block group">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search gear..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => {
                   if (location.pathname !== '/shop') navigate('/shop');
                }}
                className="w-full bg-panther-800 text-gray-200 pl-10 pr-4 py-2.5 rounded-full border border-panther-700 focus:outline-none focus:border-panther-accent focus:ring-1 focus:ring-panther-accent transition-all group-hover:border-gray-600"
              />
              <Search className="absolute left-3 top-3 text-gray-500 group-hover:text-gray-300 transition-colors" size={18} />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button 
              className="relative p-2 text-gray-300 hover:text-white transition-colors hover:bg-panther-800 rounded-full"
              onClick={openCart}
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-panther-accent rounded-full border-2 border-panther-900">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-panther-800 border-t border-panther-700 animate-slide-down">
          <div className="px-4 pt-4 pb-6 space-y-4">
             <div className="relative">
              <input 
                type="text"
                placeholder="Search gear..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-panther-900 text-gray-200 pl-10 pr-4 py-3 rounded-lg border border-panther-700 focus:border-panther-accent outline-none"
              />
              <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
            </div>
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-panther-700"
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-panther-700"
            >
              Shop All Products
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};


const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const filteredProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <NavigationBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
          openCart={() => setIsCartOpen(true)}
        />

        {/* Routes */}
        <Routes>
          <Route 
            path="/" 
            element={<HomePage products={PRODUCTS} onAddToCart={addToCart} />} 
          />
          <Route 
            path="/shop" 
            element={<ShopPage products={filteredProducts} onAddToCart={addToCart} />} 
          />
          <Route 
            path="/product/:id" 
            element={<ProductDetailsPage onAddToCart={addToCart} />} 
          />
        </Routes>

        {/* Footer */}
        <footer className="bg-panther-900 border-t border-panther-700 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">{STORE_NAME}</h2>
            <div className="flex justify-center gap-6 mb-8 text-gray-400">
               <Link to="/" className="hover:text-white">Home</Link>
               <Link to="/shop" className="hover:text-white">Shop</Link>
               <span className="hover:text-white cursor-pointer">Terms</span>
               <span className="hover:text-white cursor-pointer">Contact</span>
            </div>
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} All rights reserved. <br/>
              Dropshipping fulfillment by {STORE_NAME} Logistics.
            </p>
          </div>
        </footer>

        {/* Modals & Overlays */}
        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />

        <CheckoutModal 
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          onClearCart={clearCart}
        />

        <AiAssistant />
      </div>
    </HashRouter>
  );
};

export default App;