import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { ArrowLeft, ShoppingCart, Star, Check, Shield, Truck, RotateCcw, Share2 } from 'lucide-react';

interface ProductDetailsPageProps {
  onAddToCart: (product: Product) => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const product = PRODUCTS.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = async () => {
    if (!product) return;
    
    const url = window.location.href;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on BLACKPANTHER Store!`,
      url: url
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy", err);
      }
    }
  };

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Product Not Found</h2>
        <Link to="/" className="text-panther-accent hover:underline">Return to Store</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-panther-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="relative rounded-2xl overflow-hidden bg-panther-800 border border-panther-700 shadow-2xl group">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover min-h-[400px] lg:min-h-[600px] transform transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-panther-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                {product.name}
              </h1>
              <button 
                onClick={handleShare}
                className="p-3 bg-panther-800 rounded-full text-gray-400 hover:text-white hover:bg-panther-700 transition-all border border-panther-700"
                title="Share Product"
              >
                {copied ? <Check size={24} className="text-green-500" /> : <Share2 size={24} />}
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-panther-accent">₹{product.price}</span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <span className="text-gray-400 text-sm ml-2">(42 reviews)</span>
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {product.description}
              <br/><br/>
              Engineered for those who demand excellence. This {product.name.toLowerCase()} combines cutting-edge technology with tactical aesthetics to deliver superior performance in any environment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="bg-panther-800 p-2 rounded-lg text-panther-accent">
                  <Shield size={20} />
                </div>
                <span className="text-sm">1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="bg-panther-800 p-2 rounded-lg text-panther-accent">
                  <Truck size={20} />
                </div>
                <span className="text-sm">Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="bg-panther-800 p-2 rounded-lg text-panther-accent">
                  <RotateCcw size={20} />
                </div>
                <span className="text-sm">7-Day Easy Returns</span>
              </div>
               <div className="flex items-center gap-3 text-gray-300">
                <div className="bg-panther-800 p-2 rounded-lg text-panther-accent">
                  <Check size={20} />
                </div>
                <span className="text-sm">Verified Authentic</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex-1 bg-panther-accent hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <ShoppingCart size={24} />
                Add to Cart
              </button>
            </div>
            
            <p className="mt-6 text-sm text-center text-gray-500">
              Secure Checkout guaranteed. Orders processed within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;