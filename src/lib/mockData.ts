import { Product, StoreSettings } from './types';

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: "Luqman Fabrics",
  tagline: "Quality You Feel, Style You Love",
  whatsappNumber: "923409797271",
  displayWhatsApp: "+92 340 9797271",
  email: "luqmanfabricsshewa@gmail.com",
  location: "Shewa, Khyber Pakhtunkhwa, Pakistan",
  freeShippingThreshold: 5000,
  standardShippingFee: 250,
  announcementText: "✨ FREE  Delivery on orders over Rs. 5,000",
  showAnnouncement: true,
  bankDetails: {
    bankName: "Meezan Bank / HBL / EasyPaisa / JazzCash",
    accountTitle: "Luqman Fabrics",
    accountNumber: "0340-9797271",
    iban: "PK78MEZN0000000123456789",
  },
};

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_ORDERS: any[] = [];

export const CATEGORIES_DATA = [
  {
    id: "women-unstitched",
    name: "Women's Luxury Lawn",
    subtitle: "Swiss Voile, Digital Prints & Thread Embroidery",
    count: 14,
    image: "/images/lawn_luxury.jpg",
    slug: "women-unstitched"
  },
  {
    id: "men-unstitched",
    name: "Men's Executive Boski & Wash & Wear",
    subtitle: "Authentic 6-Pound Boski, Latha & Tropical Fabrics",
    count: 18,
    image: "/images/mens_boski.jpg",
    slug: "men-unstitched"
  },
  {
    id: "chiffon-luxury",
    name: "Chiffon & Wedding Formals",
    subtitle: "Zari, Tilla & Handcrafted Sequin Embroideries",
    count: 9,
    image: "/images/hero.jpg",
    slug: "chiffon-luxury"
  },
  {
    id: "pure-cotton",
    name: "Pure Egyptian & Giza Cotton",
    subtitle: "Superfine 100/2 Liquid Ammonia Luster Weaves",
    count: 12,
    image: "/images/mens_boski.jpg",
    slug: "pure-cotton"
  },
  {
    id: "karandi-winter",
    name: "Winter Karandi & Warm Khaddar",
    subtitle: "Textured Cotton-Silk Karandi with Heavy Shawls",
    count: 8,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    slug: "karandi-winter"
  },
  {
    id: "festive-silk",
    name: "Festive Silk & Jacquard",
    subtitle: "Banarasi Raw Silk & Zari Brocade",
    count: 7,
    image: "/images/hero.jpg",
    slug: "festive-silk"
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Dr. Farooq Shah",
    location: "Peshawar",
    rating: 5,
    comment: "The Boski fabric from Luqman Fabrics is 100% original. The fall, the sheen, and the weight are unmatched. Also, ordering directly on WhatsApp was seamless. Will definitely order again!",
    fabricBought: "Executive Royal Imperial Boski"
  },
  {
    id: 2,
    name: "Ayesha Malik",
    location: "Islamabad",
    rating: 5,
    comment: "I was hesitant buying embroidered lawn online, but the video preview they sent on WhatsApp before dispatching gave me complete confidence. The embroidery and Swiss lawn quality are 10/10.",
    fabricBought: "Aurelia Royal Gold Swiss Lawn (3-Piece)"
  },
  {
    id: 3,
    name: "Sardar Bilal Khan",
    location: "Mardan",
    rating: 5,
    comment: "Best fabric store in Shewa region. Delivered via courier in just 2 days. The Wash & Wear suit fabric is soft, cool, and wrinkle-resistant.",
    fabricBought: "Sovereign Wash & Wear Fabric"
  }
];
