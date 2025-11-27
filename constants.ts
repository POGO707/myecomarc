import { Product } from './types';

export const STORE_NAME = "BLACKPANTHER";
export const WHATSAPP_NUMBER = "916289204920"; // Your personal number

// REPLACE THIS with your Google Apps Script Web App URL after deploying
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz_XXXXXXXX_REPLACE_THIS_WITH_YOUR_REAL_URL/exec"; 

// Mock Product Data
export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Stealth Smartwatch Ultra',
    price: 2999,
    description: 'Military grade durability, 30-day battery life, complete health tracking.',
    category: 'Electronics',
    image: 'https://picsum.photos/400/400?random=1'
  },
  {
    id: '2',
    name: 'Panther Bass Earbuds',
    price: 1499,
    description: 'Active noise cancelling, deep bass profile, waterproof casing.',
    category: 'Audio',
    image: 'https://picsum.photos/400/400?random=2'
  },
  {
    id: '3',
    name: 'Vibranium Tech Hoodie',
    price: 1999,
    description: 'Premium cotton blend, water-resistant coating, hidden tech pockets.',
    category: 'Apparel',
    image: 'https://picsum.photos/400/400?random=3'
  },
  {
    id: '4',
    name: 'Night Vision Glasses',
    price: 899,
    description: 'Anti-glare, blue light filtering, sleek matte black frame.',
    category: 'Accessories',
    image: 'https://picsum.photos/400/400?random=4'
  },
  {
    id: '5',
    name: 'Tactical Backpack',
    price: 2499,
    description: '40L capacity, modular MOLLE system, laptop compartment.',
    category: 'Travel',
    image: 'https://picsum.photos/400/400?random=5'
  },
  {
    id: '6',
    name: 'Shadow Gaming Mouse',
    price: 1299,
    description: 'RGB lighting, 16000 DPI sensor, programmable macro buttons.',
    category: 'Gaming',
    image: 'https://picsum.photos/400/400?random=6'
  }
];