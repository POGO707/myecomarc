import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Eye, Share2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/#/product/${product.id}`;
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
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy", err);
      }
    }
  };

  return (
    <div className="bg-panther-800 rounded-xl overflow-hidden shadow-lg border border-panther-700 hover:border-panther-accent transition-all duration-300 group">
      <Link to={`/product/${product.id}`} className="block relative h-64 overflow-hidden cursor-pointer">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-panther-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        
        {/* Hover Icons Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px] gap-3">
           <span className="bg-panther-900/80 p-3 rounded-full text-white backdrop-blur-md border border-panther-accent shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300 hover:bg-panther-accent">
             <Eye size={24} />
           </span>
           <button 
             onClick={handleShare}
             className="bg-panther-900/80 p-3 rounded-full text-white backdrop-blur-md border border-panther-accent shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300 hover:bg-panther-accent"
             title="Share Product"
           >
             {copied ? <Check size={24} /> : <Share2 size={24} />}
           </button>
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="bg-panther-accent text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">
            {product.category}
          </span>
        </div>
      </Link>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product.id}`} className="hover:text-panther-accent transition-colors">
             <h3 className="text-xl font-bold text-white leading-tight">{product.name}</h3>
          </Link>
          <span className="text-panther-accent font-bold text-lg">₹{product.price}</span>
        </div>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <button 
          onClick={() => onAddToCart(product)}
          className="w-full bg-panther-700 hover:bg-panther-accent text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95"
        >
          <Plus size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;