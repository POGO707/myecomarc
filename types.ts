export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderDetails {
  fullName: string;
  phone: string;
  houseNo: string;
  area: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}