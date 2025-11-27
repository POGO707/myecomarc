import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { Filter, SlidersHorizontal, ChevronDown, X, Check } from 'lucide-react';

interface ShopPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ products, onAddToCart }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<{min: string, max: string}>({ min: '', max: '' });
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Extract Categories from the passed products
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...cats.sort()];
  }, [products]);

  // Filter and Sort Logic
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price Filter
    const min = priceRange.min ? parseFloat(priceRange.min) : 0;
    const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    result = result.filter(p => p.price >= min && p.price <= max);

    // Availability Filter (Simulated: assuming all are in stock for now)
    if (inStockOnly) {
       // In a real app: result = result.filter(p => p.inStock);
       // For now, we don't filter out anything as everything is "in stock"
    }
    
    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    // 'featured' keeps original order

    return result;
  }, [products, selectedCategory, priceRange, sortBy, inStockOnly]);

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setPriceRange(prev => ({ ...prev, [type]: value }));
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 bg-panther-800 text-white px-4 py-2 rounded-lg border border-panther-700"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">{processedProducts.length} Items</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-panther-800 text-white text-sm px-3 py-2 rounded-lg border border-panther-700 outline-none focus:border-panther-accent"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A - Z</option>
              <option value="name-desc">Name: Z - A</option>
            </select>
          </div>
        </div>

        {/* Sidebar / Filters */}
        <aside className={`
          fixed inset-0 z-50 bg-panther-900 lg:static lg:bg-transparent lg:z-auto lg:w-64 lg:block
          ${isMobileFilterOpen ? 'block' : 'hidden'}
        `}>
          <div className="h-full overflow-y-auto p-5 lg:p-0">
            <div className="flex justify-between items-center lg:hidden mb-6">
              <h2 className="text-xl font-bold text-white">Filters</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Category Filter */}
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  Category
                </h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`
                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                        ${selectedCategory === cat 
                          ? 'bg-panther-accent border-panther-accent' 
                          : 'border-gray-600 group-hover:border-gray-400'}
                      `}>
                         {selectedCategory === cat && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <input 
                        type="radio" 
                        name="category" 
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="hidden" 
                      />
                      <span className={`text-sm ${selectedCategory === cat ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-white font-bold mb-4">Price Range (₹)</h3>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full bg-panther-800 border border-panther-700 rounded p-2 text-sm text-white focus:border-panther-accent outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full bg-panther-800 border border-panther-700 rounded p-2 text-sm text-white focus:border-panther-accent outline-none"
                  />
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <h3 className="text-white font-bold mb-4">Availability</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                   <div className={`
                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                        ${inStockOnly 
                          ? 'bg-panther-accent border-panther-accent' 
                          : 'border-gray-600 group-hover:border-gray-400'}
                      `}>
                         {inStockOnly && <Check size={14} className="text-white" />}
                      </div>
                  <input 
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="hidden"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-gray-300">In Stock Only</span>
                </label>
              </div>
              
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setPriceRange({ min: '', max: '' });
                  setInStockOnly(false);
                }}
                className="text-panther-accent text-sm hover:underline"
              >
                Reset All Filters
              </button>

              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full mt-8 bg-panther-accent text-white font-bold py-3 rounded-lg lg:hidden"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white hidden lg:block">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            
            <div className="hidden lg:flex items-center gap-4 ml-auto">
               <span className="text-gray-400 text-sm">{processedProducts.length} Products Found</span>
               <div className="relative group">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-panther-800 text-white pl-4 pr-10 py-2 rounded-lg border border-panther-700 cursor-pointer focus:border-panther-accent outline-none"
                  >
                    <option value="featured">Sort by: Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A - Z</option>
                    <option value="name-desc">Name: Z - A</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
               </div>
            </div>
          </div>

          {processedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
              {processedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={onAddToCart} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-panther-800/50 rounded-2xl border border-panther-700 border-dashed">
              <Filter className="text-gray-600 mb-4" size={48} />
              <p className="text-gray-400 text-xl font-medium mb-2">No products match your filters.</p>
              <button 
                 onClick={() => {
                  setSelectedCategory('All');
                  setPriceRange({ min: '', max: '' });
                  setInStockOnly(false);
                }}
                className="text-panther-accent hover:underline mt-2"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ShopPage;