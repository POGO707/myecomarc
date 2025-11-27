import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemove,
  onCheckout
}) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Sidebar Panel */}
      <div className="relative w-full max-w-md bg-panther-800 h-full shadow-2xl flex flex-col border-l border-panther-700 transform transition-transform duration-300">
        <div className="p-5 flex items-center justify-between border-b border-panther-700">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-panther-accent" />
            <h2 className="text-xl font-bold text-white">Your Cart</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-panther-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <ShoppingBag size={48} className="mb-4 opacity-50" />
              <p>Your cart is empty.</p>
              <button onClick={onClose} className="mt-4 text-panther-accent hover:underline">Start Shopping</button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-panther-900 p-3 rounded-lg flex gap-3 border border-panther-700">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-gray-800" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-white line-clamp-1">{item.name}</h4>
                    <p className="text-panther-accent text-sm font-medium">₹{item.price}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-panther-800 rounded px-2 py-1 border border-panther-700">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="text-gray-400 hover:text-white px-1"
                      >-</button>
                      <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="text-gray-400 hover:text-white px-1"
                      >+</button>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-panther-700 bg-panther-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Total Amount</span>
              <span className="text-2xl font-bold text-white">₹{total}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-green-500/20 transition-all active:scale-95"
            >
              Checkout Now
            </button>
            <p className="text-xs text-center text-gray-500 mt-3">
              Checkout via WhatsApp securely
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
