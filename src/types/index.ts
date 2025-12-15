export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice?: number;
  description: string;
  imageUrls: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  materials: string[];
  weight?: string;
  dimensions?: string;
  tags: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: Date;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'cod';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  estimatedDelivery?: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  products?: Product[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  code?: string;
  imageUrl: string;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
}