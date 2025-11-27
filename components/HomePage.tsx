import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { ArrowRight, Zap } from 'lucide-react';

interface HomePageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const HomePage: React.FC<HomePageProps> = ({ products, onAddToCart }) => {
  // Show only first 3 products as "Featured"
  const featuredProducts = products.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-panther-800 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/1920/600?grayscale" 
            className="w-full h-full object-cover opacity-20" 
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-panther-900 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 bg-panther-accent/20 border border-panther-accent/40 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-panther-accent animate-pulse"></span>
            <span className="text-panther-accent text-sm font-bold tracking-wide uppercase">New Collection Drop</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
            UNLEASH YOUR <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-panther-accent filter drop-shadow-lg">INNER POWER</span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Premium gear delivered directly to your doorstep. Verified quality. Secure payments via WhatsApp.
          </p>
          
          <div className="mt-10 flex justify-center gap-4">
            <Link 
              to="/shop" 
              className="bg-white text-panther-900 hover:bg-gray-200 font-bold py-4 px-8 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Shop Collection <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-panther-accent p-2 rounded-lg">
              <Zap className="text-white" size={24} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold text-white">Trending Gear</h2>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-2 text-panther-accent font-semibold hover:text-white transition-colors group">
            View All Products 
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>

        <div className="mt-12 text-center sm:hidden">
           <Link to="/shop" className="inline-block bg-panther-800 hover:bg-panther-700 text-white font-bold py-3 px-8 rounded-xl border border-panther-700 transition-colors">
            View All Products
          </Link>
        </div>
      </main>
      
      {/* Features Banner */}
      <div className="bg-panther-800 border-y border-panther-700 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
             <h3 className="text-white text-xl font-bold mb-2">Premium Quality</h3>
             <p className="text-gray-400">Hand-picked gear that meets the highest standards.</p>
          </div>
          <div className="p-6 border-l-0 md:border-l border-panther-700">
             <h3 className="text-white text-xl font-bold mb-2">Fast Shipping</h3>
             <p className="text-gray-400">Express delivery across the country.</p>
          </div>
          <div className="p-6 border-l-0 md:border-l border-panther-700">
             <h3 className="text-white text-xl font-bold mb-2">Secure Support</h3>
             <p className="text-gray-400">24/7 assistance via WhatsApp & AI.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;