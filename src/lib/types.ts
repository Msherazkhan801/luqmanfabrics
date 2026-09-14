export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice?: number;
  category: 'women-unstitched' | 'men-unstitched' | 'chiffon-luxury' | 'pure-cotton' | 'karandi-winter' | 'festive-silk' | 'all';
  fabricType: string; // e.g. "Pure Swiss Lawn", "Superfine Boski", "Pure Chiffon", "Egyptian Giza Cotton", "Textured Karandi", "Raw Silk Zari"
  cutLength: string; // e.g. "3-Piece (7.5m)", "Unstitched 4.5m Men's Suit", "2-Piece (5m)", "Shirt & Dupatta"
  pieces: string; // "3-Piece", "2-Piece", "1-Piece", "4.5m Suit"
  description: string;
  details: string[];
  features: {
    weave: string;
    season: 'All Seasons' | 'Summer' | 'Winter' | 'Festive / Wedding' | 'Mid-Season';
    transparency: 'Opaque' | 'Semi-Sheer (Slip Needed)' | 'Non-Transparent';
    softness: 'Silky Smooth' | 'Soft & Crisp' | 'Ultra Soft / Breathable' | 'Warm & Rich';
    shrinkage: string;
  };
  colors: {
    name: string;
    hex: string;
    image: string;
  }[];
  images: string[];
  badge?: 'New Arrival' | 'Bestseller' | 'Sale' | 'Exclusive Luxury' | 'Limited Stock';
  stock: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedColor: {
    name: string;
    hex: string;
    image: string;
  };
  quantity: number;
  customNotes?: string;
}

export interface CustomerDetails {
  fullName: string;
  whatsappNumber: string;
  alternatePhone?: string;
  email?: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  orderNotes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'bank-transfer';

export interface Order {
  id: string;
  orderNumber: string; // e.g., "LF-83921"
  customer: CustomerDetails;
  items: {
    productId: string;
    productName: string;
    colorName: string;
    colorHex: string;
    image: string;
    cutLength: string;
    price: number;
    quantity: number;
    total: number;
  }[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  promoCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  whatsappSent?: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string; // "+923409797271"
  displayWhatsApp: string; // "+92 340 9797271"
  email: string; // "luqmanfabricsshewa@gmail.com"
  location: string; // "Shewa, Khyber Pakhtunkhwa, Pakistan"
  freeShippingThreshold: number; // 5000 PKR
  standardShippingFee: number; // 250 PKR
  announcementText: string;
  showAnnouncement: boolean;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
  };
}

export interface FilterState {
  category: string;
  fabricType: string[];
  season: string[];
  pieces: string[];
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest' | 'rating';
  searchQuery: string;
}
